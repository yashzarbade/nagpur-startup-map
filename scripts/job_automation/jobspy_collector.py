import os
import sys
import json
import time
import random
import logging
from datetime import datetime
from typing import Dict, Any, List, Tuple, Optional

# Ensure script directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("job_automation.jobspy")

# Import db layer
try:
    from db import get_db_connection, upsert_job, log_source_health
except ImportError:
    get_db_connection = None
    upsert_job = None
    log_source_health = None

# Attempt import of JobSpy safely
try:
    from jobspy import scrape_jobs
    JOBSPY_AVAILABLE = True
except ImportError as e:
    JOBSPY_AVAILABLE = False
    logger.warning(f"python-jobspy is not installed or import failed ({e}). Running in mock/dry-run mode.")


def load_config() -> Tuple[Dict[str, Any], Dict[str, Any]]:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sources_file = os.path.join(base_dir, "config", "sources.json")
    keywords_file = os.path.join(base_dir, "config", "keywords.json")
    
    with open(sources_file, "r", encoding="utf-8") as f:
        sources_cfg = json.load(f)
        
    with open(keywords_file, "r", encoding="utf-8") as f:
        keywords_cfg = json.load(f)
        
    return sources_cfg, keywords_cfg


def get_active_keywords(keywords_cfg: Dict[str, Any]) -> List[str]:
    keywords = []
    categories = keywords_cfg.get("categories", {})
    for cat_key, cat_data in categories.items():
        if cat_data.get("enabled", True):
            keywords.extend(cat_data.get("keywords", []))
    return list(dict.fromkeys(keywords))  # Deduplicate while preserving order


def map_jobspy_to_normalized(row: Dict[str, Any], city: Dict[str, Any], source_type: str) -> Dict[str, Any]:
    """
    Map raw jobspy pandas/dict row to our normalized database schema.
    """
    title = str(row.get("title") or "").strip()
    company = str(row.get("company") or "Direct Employer").strip()
    location = str(row.get("location") or city["search_location"]).strip()
    
    is_remote = bool(row.get("is_remote", False))
    remote_type = "REMOTE" if is_remote else "ON_SITE"
    if "hybrid" in (location + " " + title).lower():
        remote_type = "HYBRID"
        
    job_type_raw = str(row.get("job_type") or "").lower()
    employment_type = "FULL_TIME"
    if "intern" in job_type_raw or "intern" in title.lower():
        employment_type = "INTERNSHIP"
    elif "part" in job_type_raw:
        employment_type = "PART_TIME"
    elif "contract" in job_type_raw:
        employment_type = "CONTRACT"
    elif "freelance" in job_type_raw:
        employment_type = "FREELANCE"
        
    min_amount = row.get("min_amount")
    max_amount = row.get("max_amount")
    currency = str(row.get("currency") or "INR")
    
    salary_min = int(min_amount) if min_amount is not None and str(min_amount).isdigit() else None
    salary_max = int(max_amount) if max_amount is not None and str(max_amount).isdigit() else None
    
    posted_date = row.get("date_posted")
    posted_at = None
    if posted_date:
        try:
            if isinstance(posted_date, datetime):
                posted_at = posted_date
            else:
                posted_at = datetime.fromisoformat(str(posted_date).replace("Z", "+00:00"))
        except Exception:
            posted_at = datetime.now()
            
    job_url = str(row.get("job_url") or "").strip()
    raw_id = str(row.get("id") or "").strip() or None
    description = str(row.get("description") or "").strip() or None

    return {
        "title": title,
        "company_name": company,
        "city_id": city["city_id"],
        "location": location,
        "remote_type": remote_type,
        "employment_type": employment_type,
        "application_url": job_url,
        "source_url": job_url,
        "source_type": source_type.upper(),
        "source_job_id": raw_id,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "currency": currency,
        "description": description,
        "posted_at": posted_at or datetime.now(),
        "is_walkin": False,
        "verification_status": "PENDING"
    }


def run_jobspy_collector(target_city_slug: Optional[str] = None, target_source: Optional[str] = None) -> Dict[str, Any]:
    """
    Main JobSpy execution routine.
    Searches each city and enabled source independently with strict failure isolation.
    """
    sources_cfg, keywords_cfg = load_config()
    keywords = get_active_keywords(keywords_cfg)
    
    cities = sources_cfg.get("cities", [])
    if target_city_slug:
        cities = [c for c in cities if c["slug"].lower() == target_city_slug.lower()]
        
    jobspy_cfg = sources_cfg.get("jobspy", {})
    if not jobspy_cfg.get("enabled", True):
        logger.info("JobSpy collector is disabled in configuration.")
        return {"status": "disabled", "results": []}
        
    source_configs = jobspy_cfg.get("sources", {})
    results_summary = []
    
    # Establish DB connection
    conn = None
    try:
        conn = get_db_connection()
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return {"status": "error", "message": str(e)}

    # Process each city independently
    for city in cities:
        if not city.get("enabled", True):
            continue
            
        city_slug = city["slug"]
        search_location = city["search_location"]
        logger.info(f"=== Starting JobSpy collection for {city['name']} ({city_slug}) ===")

        # Process each enabled source independently
        for site_name, site_cfg in source_configs.items():
            if target_source and site_name.lower() != target_source.lower():
                continue
            if not site_cfg.get("enabled", True):
                continue
                
            source_type = site_name.upper()
            rate_limit_delay = site_cfg.get("rate_limit_delay_sec", 2)
            timeout = site_cfg.get("timeout_sec", 30)
            
            logger.info(f"Searching source: {source_type} for {city['name']}...")
            
            metrics = {
                "discovered": 0,
                "inserted": 0,
                "updated": 0,
                "error": None
            }
            
            # Select top keywords to query for this run
            sample_keywords = keywords[:8] if len(keywords) > 8 else keywords
            
            for query in sample_keywords:
                try:
                    logger.info(f"[{source_type} | {city_slug}] Querying: '{query}' in '{search_location}'")
                    
                    if not JOBSPY_AVAILABLE:
                        logger.info("JobSpy package not available. Simulating safe idle response.")
                        break
                        
                    # Call jobspy with timeout and source restriction
                    # Note: site_name must be one of: "indeed", "linkedin", "naukri", etc.
                    df = scrape_jobs(
                        site_name=[site_name.lower()],
                        search_term=query,
                        location=search_location,
                        results_wanted=min(site_cfg.get("max_results", 10), 10),
                        hours_old=jobspy_cfg.get("hours_old", 72),
                        country_indeed="india" if site_name.lower() == "indeed" else None,
                        linkedin_fetch_description=True if site_name.lower() == "linkedin" else False,
                    )
                    
                    if df is not None and not df.empty:
                        records = df.to_dict(orient="records")
                        metrics["discovered"] += len(records)
                        
                        for raw_job in records:
                            norm_job = map_jobspy_to_normalized(raw_job, city, source_type)
                            action, job_id = upsert_job(conn, norm_job)
                            if action == "created":
                                metrics["inserted"] += 1
                            elif action == "updated":
                                metrics["updated"] += 1
                                
                    # Respectful rate limiting with jitter
                    sleep_time = rate_limit_delay + random.uniform(0.5, 1.5)
                    time.sleep(sleep_time)
                    
                except Exception as query_err:
                    err_msg = str(query_err)
                    logger.warning(f"Error querying {source_type} for '{query}' in {city_slug}: {err_msg}")
                    metrics["error"] = err_msg
                    # Continue to next keyword or source, do not abort
                    time.sleep(2.0)
                    
            status_str = "FAILED" if metrics["error"] and metrics["discovered"] == 0 else "HEALTHY"
            
            log_source_health(
                conn=conn,
                source_type=source_type,
                source_name=f"JobSpy-{source_type}",
                city_slug=city_slug,
                status=status_str,
                jobs_discovered=metrics["discovered"],
                jobs_inserted=metrics["inserted"],
                jobs_updated=metrics["updated"],
                error_summary=metrics["error"]
            )
            
            results_summary.append({
                "city": city_slug,
                "source": source_type,
                "metrics": metrics
            })
            
    if conn:
        conn.close()
        
    return {"status": "completed", "results": results_summary}


if __name__ == "__main__":
    target_city = sys.argv[1] if len(sys.argv) > 1 else None
    target_src = sys.argv[2] if len(sys.argv) > 2 else None
    print(f"Running JobSpy collector (City: {target_city or 'ALL'}, Source: {target_src or 'ALL'})...")
    res = run_jobspy_collector(target_city, target_src)
    print(json.dumps(res, indent=2))
