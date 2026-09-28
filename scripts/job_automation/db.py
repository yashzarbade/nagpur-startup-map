import os
import re
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

try:
    from dotenv import load_dotenv
    load_dotenv(".env.local")
    load_dotenv(".env")
except ImportError:
    pass

logger = logging.getLogger("job_automation.db")


def get_db_connection():
    if not PSYCOPG2_AVAILABLE:
        raise RuntimeError("psycopg2 is not installed. Install psycopg2-binary to connect to Postgres.")
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL is not configured in environment or .env file.")
    
    # Supabase / cloud postgres requires sslmode=require
    if "sslmode" not in db_url and "localhost" not in db_url:
        sep = "&" if "?" in db_url else "?"
        db_url += f"{sep}sslmode=require"
        
    return psycopg2.connect(db_url, cursor_factory=RealDictCursor)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text[:100]


def ensure_company(conn, company_name: str, city_id: int = 1, website_url: Optional[str] = None) -> Tuple[int, str]:
    """
    Find existing company by slug/name or safely create a pending stub.
    Preserves foreign key integrity with `jobs.company_id`.
    """
    name_clean = company_name.strip() if company_name else "Independent Recruiter"
    base_slug = slugify(name_clean) or "company"
    
    with conn.cursor() as cur:
        # 1. Search existing company
        cur.execute(
            """
            SELECT id, slug FROM companies 
            WHERE slug = %s OR LOWER(name) = LOWER(%s)
            LIMIT 1
            """,
            (base_slug, name_clean)
        )
        row = cur.fetchone()
        if row:
            return row["id"], row["slug"]
            
        # 2. Insert stub company with PENDING status
        unique_slug = f"{base_slug}-{os.urandom(2).hex()}"
        cur.execute(
            """
            INSERT INTO companies (
                name, slug, city_id, website_url, verification_status, hiring, 
                description_short, created_at, updated_at
            ) VALUES (%s, %s, %s, %s, 'PENDING', true, %s, NOW(), NOW())
            RETURNING id, slug
            """,
            (name_clean, unique_slug, city_id, website_url, f"{name_clean} hiring in Central India.")
        )
        new_row = cur.fetchone()
        conn.commit()
        return new_row["id"], new_row["slug"]


def generate_dedup_key(title: str, company_name: str, city_id: int, walkin_date: Optional[str] = None) -> str:
    norm_title = slugify(title)
    norm_comp = slugify(company_name)
    date_part = f":d{walkin_date[:10]}" if walkin_date else ""
    return f"{norm_comp}:{norm_title}:c{city_id}{date_part}"[:250]


def upsert_job(conn, job_data: Dict[str, Any]) -> Tuple[str, Optional[int]]:
    """
    Upserts a normalized job. Returns ('created' | 'updated' | 'skipped', job_id).
    Prevents duplicates using:
    1. source_type + source_job_id
    2. deduplication_key
    3. application_url
    """
    title = (job_data.get("title") or "").strip()
    if not title:
        return "skipped", None
        
    company_name = job_data.get("company_name", "Employer")
    city_id = int(job_data.get("city_id") or 1)
    company_id, company_slug = ensure_company(conn, company_name, city_id, job_data.get("company_url"))
    
    source_type = job_data.get("source_type", "GENERIC_CAREERS_PAGE")
    source_job_id = job_data.get("source_job_id") or job_data.get("external_job_id")
    source_url = job_data.get("source_url")
    application_url = job_data.get("application_url") or source_url or "https://centralindiatech.com/jobs"
    
    walkin_date = job_data.get("walkin_date")
    dedup_key = job_data.get("deduplication_key") or generate_dedup_key(title, company_name, city_id, str(walkin_date) if walkin_date else None)
    
    with conn.cursor() as cur:
        # Check duplicate by external ID
        existing_id = None
        if source_job_id and source_type:
            cur.execute(
                """
                SELECT id FROM jobs 
                WHERE source_type = %s AND (source_job_id = %s OR external_job_id = %s)
                LIMIT 1
                """,
                (source_type, str(source_job_id), str(source_job_id))
            )
            row = cur.fetchone()
            if row:
                existing_id = row["id"]
                
        # Check duplicate by dedup_key
        if not existing_id and dedup_key:
            cur.execute(
                "SELECT id FROM jobs WHERE deduplication_key = %s LIMIT 1",
                (dedup_key,)
            )
            row = cur.fetchone()
            if row:
                existing_id = row["id"]
                
        # Check duplicate by canonical URL
        if not existing_id and application_url and application_url.startswith("http"):
            cur.execute(
                """
                SELECT id FROM jobs 
                WHERE company_id = %s AND application_url = %s
                LIMIT 1
                """,
                (company_id, application_url)
            )
            row = cur.fetchone()
            if row:
                existing_id = row["id"]
                
        now = datetime.now()
        
        if existing_id:
            # Update existing record
            cur.execute(
                """
                UPDATE jobs SET
                    title = %s,
                    description = COALESCE(%s, description),
                    location = COALESCE(%s, location),
                    remote_type = COALESCE(%s, remote_type),
                    employment_type = COALESCE(%s, employment_type),
                    application_url = %s,
                    source_url = COALESCE(%s, source_url),
                    salary_min = COALESCE(%s, salary_min),
                    salary_max = COALESCE(%s, salary_max),
                    currency = COALESCE(%s, currency),
                    skills = COALESCE(%s, skills),
                    is_walkin = COALESCE(%s, is_walkin),
                    walkin_date = COALESCE(%s, walkin_date),
                    walkin_start_time = COALESCE(%s, walkin_start_time),
                    walkin_end_time = COALESCE(%s, walkin_end_time),
                    walkin_venue = COALESCE(%s, walkin_venue),
                    last_seen_at = %s,
                    last_checked_at = %s,
                    missed_sync_count = 0,
                    status = 'ACTIVE',
                    updated_at = %s
                WHERE id = %s
                """,
                (
                    title,
                    job_data.get("description"),
                    job_data.get("location"),
                    job_data.get("remote_type", "ON_SITE"),
                    job_data.get("employment_type", "FULL_TIME"),
                    application_url,
                    source_url,
                    job_data.get("salary_min"),
                    job_data.get("salary_max"),
                    job_data.get("currency", "INR"),
                    job_data.get("skills"),
                    job_data.get("is_walkin", False),
                    walkin_date,
                    job_data.get("walkin_start_time"),
                    job_data.get("walkin_end_time"),
                    job_data.get("walkin_venue"),
                    now,
                    now,
                    now,
                    existing_id
                )
            )
            conn.commit()
            return "updated", existing_id
        else:
            # Create new job
            slug_base = f"{company_slug}-{slugify(title)}"
            rand_suffix = os.urandom(3).hex()
            slug = f"{slug_base}-{rand_suffix}"[:290]
            
            cur.execute(
                """
                INSERT INTO jobs (
                    company_id, city_id, title, slug, description, location,
                    remote_type, employment_type, application_url, source_url,
                    source_type, external_job_id, source_job_id, source_channel, source_message_id,
                    department, skills, salary_min, salary_max, currency,
                    is_walkin, walkin_date, walkin_start_time, walkin_end_time, walkin_venue,
                    verification_status, moderation_status, deduplication_key, contact_details,
                    posted_at, last_seen_at, last_checked_at, missed_sync_count, status,
                    created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, 0, 'ACTIVE',
                    NOW(), NOW()
                ) RETURNING id
                """,
                (
                    company_id,
                    city_id,
                    title,
                    slug,
                    job_data.get("description"),
                    job_data.get("location"),
                    job_data.get("remote_type", "ON_SITE"),
                    job_data.get("employment_type", "FULL_TIME"),
                    application_url,
                    source_url,
                    source_type,
                    source_job_id,
                    source_job_id,
                    job_data.get("source_channel"),
                    job_data.get("source_message_id"),
                    job_data.get("department"),
                    job_data.get("skills"),
                    job_data.get("salary_min"),
                    job_data.get("salary_max"),
                    job_data.get("currency", "INR"),
                    job_data.get("is_walkin", False),
                    walkin_date,
                    job_data.get("walkin_start_time"),
                    job_data.get("walkin_end_time"),
                    job_data.get("walkin_venue"),
                    job_data.get("verification_status", "PENDING"),
                    job_data.get("moderation_status", "APPROVED"),
                    dedup_key,
                    job_data.get("contact_details"),
                    job_data.get("posted_at") or now,
                    now,
                    now
                )
            )
            new_id = cur.fetchone()["id"]
            conn.commit()
            return "created", new_id


def log_source_health(
    conn,
    source_type: str,
    source_name: str,
    city_slug: Optional[str],
    status: str,
    jobs_discovered: int,
    jobs_inserted: int,
    jobs_updated: int,
    jobs_expired: int = 0,
    error_summary: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO job_source_health (
                    source_type, source_name, city_slug, status, last_sync_at,
                    last_success_at, jobs_discovered, jobs_inserted, jobs_updated,
                    jobs_expired, error_summary, metadata, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, NOW(),
                    CASE WHEN %s IN ('HEALTHY', 'SUCCESS') THEN NOW() ELSE NULL END,
                    %s, %s, %s,
                    %s, %s, %s, NOW(), NOW()
                )
                """,
                (
                    source_type,
                    source_name,
                    city_slug,
                    status,
                    status,
                    jobs_discovered,
                    jobs_inserted,
                    jobs_updated,
                    jobs_expired,
                    error_summary,
                    json.dumps(metadata) if metadata else None
                )
            )
            conn.commit()
    except Exception as e:
        logger.error(f"Failed to log source health: {e}")
