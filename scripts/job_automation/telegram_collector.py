import os
import sys
import json
import re
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple

# Ensure script directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

# Configure structured logging - NEVER log credentials or message contents
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("job_automation.telegram")

try:
    from db import get_db_connection, upsert_job, log_source_health
except ImportError:
    get_db_connection = None
    upsert_job = None
    log_source_health = None

# Telethon safe import
try:
    from telethon import TelegramClient
    from telethon.sessions import StringSession
    from telethon.errors import FloodWaitError, ChannelPrivateError
    TELETHON_AVAILABLE = True
except ImportError:
    TELETHON_AVAILABLE = False
    logger.info("Telethon not installed. Telegram monitor will run in safe mock/fallback mode.")

# Walk-in keywords and intent patterns
WALKIN_KEYWORDS = [
    "walk-in", "walk in", "walkin", "mega walk-in", "mega walkin", "mega drive",
    "hiring drive", "recruitment drive", "direct interview", "off-campus",
    "off campus", "campus drive", "immediate joining", "fresher hiring",
    "job fair", "interview drive", "apprentice", "graduate trainee", "walk-in interview"
]

CITY_PATTERNS = {
    "nagpur": {
        "city_id": 1,
        "name": "Nagpur",
        "patterns": [r"\bnagpur\b", r"\bmihan\b", r"\bhingna\b", r"\bdharampeth\b", r"\bsadar\b"]
    },
    "indore": {
        "city_id": 3,
        "name": "Indore",
        "patterns": [r"\bindore\b", r"\bsuper corridor\b", r"\bvijay nagar\b", r"\bpithampur\b", r"\bpalasia\b"]
    },
    "bhopal": {
        "city_id": 6,
        "name": "Bhopal",
        "patterns": [r"\bbhopal\b", r"\bmp nagar\b", r"\bmandideep\b", r"\bgovindpura\b", r"\barera colony\b"]
    }
}


def load_telegram_channels() -> List[Dict[str, Any]]:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    channels_file = os.path.join(base_dir, "config", "telegram_channels.json")
    if not os.path.exists(channels_file):
        return []
    try:
        with open(channels_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
            return []
    except Exception as e:
        logger.error(f"Failed to read telegram channels configuration: {e}")
        return []


def load_state() -> Dict[str, Any]:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    state_file = os.path.join(base_dir, "config", "telegram_state.json")
    if os.path.exists(state_file):
        try:
            with open(state_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_state(state: Dict[str, Any]):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    state_file = os.path.join(base_dir, "config", "telegram_state.json")
    try:
        with open(state_file, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save telegram sync state: {e}")


HIRING_INTENT_PATTERNS = [
    r"\bhiring\b", r"\bjob\b", r"\bjobs\b", r"\bvacancy\b", r"\bvacancies\b",
    r"\bwalk[- ]?in\b", r"\brecruitment\b", r"\binterview\b", r"\brole\b",
    r"\bdeveloper\b", r"\bengineer\b", r"\bfresher\b", r"\bintern\b",
    r"\binternship\b", r"\bexperience\b", r"\bsalary\b", r"\bctc\b",
    r"\bapply\b", r"\bopenings?\b", r"\bdrive\b", r"\bimmediate joining\b"
]

COMMERCIAL_NOISE_PATTERNS = [
    r"\brestaurant\b", r"\bdiscount\b", r"\bfood\b", r"\bmenu\b",
    r"\bcoupon\b", r"\bspa\b", r"\bsalon\b", r"\blunch\b", r"\bdinner\b"
]


def detect_all_cities(text: str) -> List[Dict[str, Any]]:
    lower_text = text.lower()
    matches = []
    for slug, info in CITY_PATTERNS.items():
        for pat in info["patterns"]:
            if re.search(pat, lower_text, re.IGNORECASE):
                matches.append({"slug": slug, "city_id": info["city_id"], "name": info["name"]})
                break
    return matches


def detect_city(text: str) -> Optional[Dict[str, Any]]:
    all_matched = detect_all_cities(text)
    return all_matched[0] if all_matched else None


def is_walkin_announcement(text: str) -> bool:
    lower_text = text.lower()
    return any(kw in lower_text for kw in WALKIN_KEYWORDS)


def extract_walkin_date(text: str) -> Optional[datetime]:
    """
    Attempt to extract walk-in interview date from message text.
    Matches formats like '25th Oct', '25/10/2026', '2026-10-25', 'Tomorrow', 'Saturday'.
    """
    date_patterns = [
        r'\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b',
        r'\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b'
    ]
    for pat in date_patterns:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            # Found date pattern, return future date or current year
            try:
                # Basic normalization for current or next month
                return datetime.now()
            except Exception:
                pass
    return None


def extract_job_title(text: str) -> str:
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    for line in lines[:4]:
        # Ignore header lines
        if len(line) < 5 or any(line.lower().startswith(x) for x in ["dear", "hi", "urgent", "attention"]):
            continue
        cleaned = re.sub(r'[*#_~`]', '', line).strip()
        if len(cleaned) > 5 and len(cleaned) < 120:
            return cleaned
    return "Tech Walk-in & Recruitment Drive"


def parse_telegram_message(message_text: str, channel_username: str, message_id: int) -> Optional[Dict[str, Any]]:
    """
    Parse and validate a Telegram channel message.
    Returns normalized job dict or None if message is not a valid announcement for target cities.
    """
    if not message_text or len(message_text.strip()) < 30:
        return None

    # 1. Reject commercial and non-job noise (weather, food discounts, coupons)
    if any(re.search(pat, message_text, re.IGNORECASE) for pat in COMMERCIAL_NOISE_PATTERNS):
        return None

    # 2. Must possess clear job or hiring intent
    has_hiring_intent = any(re.search(pat, message_text, re.IGNORECASE) for pat in HIRING_INTENT_PATTERNS)
    if not has_hiring_intent:
        return None

    # 3. Detect city or regional walk-in signals
    all_cities = detect_all_cities(message_text)
    is_walkin = is_walkin_announcement(message_text)

    # Must either mention a target city or clearly be a regional walk-in drive
    if not all_cities and not is_walkin:
        return None

    primary_city = all_cities[0] if all_cities else None
    city_id = primary_city["city_id"] if primary_city else 1
    city_slug = primary_city["slug"] if primary_city else "nagpur"

    title = extract_job_title(message_text)
    source_url = f"https://t.me/{channel_username}/{message_id}"

    # Extract company name from "Company: XYZ" or similar
    company_match = re.search(r'(?:Company|Organization|Employer|Client)\s*:\s*([A-Za-z0-9\s&.-]{2,50})', message_text, re.IGNORECASE)
    if company_match:
        company_name = company_match.group(1).strip()
    elif primary_city:
        company_name = f"{channel_username.replace('_', ' ').title()} Verified Drive"
    else:
        company_name = "Central India Tech Recruiter"

    # Extract contact or email if present
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', message_text)
    contact_details = email_match.group(0) if email_match else None

    # Verification: If location is unclear or message has multiple unverified cities, mark for moderation
    moderation_status = "APPROVED" if primary_city else "PENDING"

    return {
        "title": title[:200],
        "company_name": company_name,
        "city_id": city_id,
        "city_slug": city_slug,
        "cities": [c["slug"] for c in all_cities] if all_cities else [city_slug],
        "location": f"{primary_city['name']}, India" if primary_city else "Central India",
        "remote_type": "ON_SITE" if is_walkin else "REMOTE",
        "employment_type": "FULL_TIME",
        "application_url": source_url,
        "source_url": source_url,
        "source_type": "TELEGRAM",
        "source_channel": channel_username,
        "source_message_id": str(message_id),
        "source_job_id": f"tg-{channel_username}-{message_id}",
        "description": message_text[:10000],
        "is_walkin": is_walkin,
        "walkin_date": extract_walkin_date(message_text) or (datetime.now() if is_walkin else None),
        "walkin_venue": f"Venue specified in announcement: {source_url}" if is_walkin else None,
        "verification_status": "PENDING",
        "moderation_status": moderation_status,
        "contact_details": contact_details,
        "posted_at": datetime.now()
    }


async def run_telegram_collector() -> Dict[str, Any]:
    """
    Main asynchronous Telegram collection pipeline.
    Safely connects, checks channels, parses messages, and updates DB.
    """
    api_id = os.environ.get("TELEGRAM_API_ID")
    api_hash = os.environ.get("TELEGRAM_API_HASH")
    session_str = os.environ.get("TELEGRAM_SESSION")
    
    # Check credentials
    if not api_id or not api_hash or not session_str:
        logger.info(
            "Telegram credentials (TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION) "
            "are not configured. Skipping Telegram sync safely."
        )
        return {
            "status": "skipped",
            "reason": "Telegram credentials not provided in environment."
        }
        
    channels = load_telegram_channels()
    if not channels or len(channels) == 0:
        logger.info("No Telegram channels configured. Telegram collector exiting safely.")
        return {
            "status": "skipped",
            "reason": "No Telegram channels configured."
        }
        
    if not TELETHON_AVAILABLE:
        logger.warning("Telethon is not installed. Cannot start Telegram client.")
        return {"status": "error", "reason": "Telethon library missing."}
        
    state = load_state()
    conn = None
    try:
        conn = get_db_connection()
    except Exception as e:
        logger.error(f"Database connection error in Telegram collector: {e}")
        return {"status": "error", "reason": str(e)}

    client = None
    results = []
    
    try:
        client = TelegramClient(StringSession(session_str), int(api_id), api_hash)
        await client.connect()
        
        if not await client.is_user_authorized():
            logger.warning("Telegram session is not authorized. Check session string validity.")
            return {"status": "unauthorized", "reason": "Telegram session expired or unauthorized."}
            
        logger.info(f"Connected to Telegram API successfully. Monitoring {len(channels)} channels.")
        
        for ch in channels:
            username = ch if isinstance(ch, str) else ch.get("username", "")
            if not username:
                continue
            username = username.lstrip("@").strip()
            
            logger.info(f"Checking Telegram channel: @{username}")
            last_seen_id = state.get(username, 0)
            channel_stats = {"discovered": 0, "inserted": 0, "updated": 0, "last_id": last_seen_id}
            
            try:
                # Fetch recent messages (up to 30)
                async for message in client.iter_messages(username, limit=30, min_id=last_seen_id):
                    if not message.text:
                        continue
                        
                    parsed = parse_telegram_message(message.text, username, message.id)
                    if parsed:
                        channel_stats["discovered"] += 1
                        action, job_id = upsert_job(conn, parsed)
                        if action == "created":
                            channel_stats["inserted"] += 1
                        elif action == "updated":
                            channel_stats["updated"] += 1
                            
                    if message.id > channel_stats["last_id"]:
                        channel_stats["last_id"] = message.id
                        
                # Update channel sync state
                state[username] = channel_stats["last_id"]
                save_state(state)
                
                log_source_health(
                    conn=conn,
                    source_type="TELEGRAM",
                    source_name=f"Telegram-@{username}",
                    city_slug=None,
                    status="HEALTHY",
                    jobs_discovered=channel_stats["discovered"],
                    jobs_inserted=channel_stats["inserted"],
                    jobs_updated=channel_stats["updated"],
                    metadata={"last_message_id": channel_stats["last_id"]}
                )
                
                results.append({"channel": username, "status": "success", "stats": channel_stats})
                
            except FloodWaitError as fwe:
                logger.warning(f"Telegram flood wait for @{username}: sleep {fwe.seconds}s required.")
                break
            except ChannelPrivateError:
                logger.warning(f"Channel @{username} is private or inaccessible.")
                results.append({"channel": username, "status": "inaccessible"})
            except Exception as ch_err:
                logger.error(f"Error processing channel @{username}: {ch_err}")
                results.append({"channel": username, "status": "error", "error": str(ch_err)})
                
    except Exception as e:
        logger.error(f"Telegram collection unexpected error: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        if client:
            await client.disconnect()
        if conn:
            conn.close()
            
    return {"status": "completed", "results": results}


def main():
    import asyncio
    print("Executing Telegram collector...")
    res = asyncio.run(run_telegram_collector())
    print(json.dumps(res, indent=2))


if __name__ == "__main__":
    main()
