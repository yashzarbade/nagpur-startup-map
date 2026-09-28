import os
import sys
import json
import logging
import argparse
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("job_automation.runner")

from jobspy_collector import run_jobspy_collector
from telegram_collector import run_telegram_collector
import asyncio


def parse_args():
    parser = argparse.ArgumentParser(description="Central India Tech Job Automation Runner")
    parser.add_argument("--source", type=str, default=None, help="Filter by source (indeed, linkedin, naukri, telegram)")
    parser.add_argument("--city", type=str, default=None, help="Filter by city slug (nagpur, indore, bhopal)")
    parser.add_argument("--mode", type=str, default="all", choices=["all", "jobspy", "telegram"], help="Collector mode to run")
    return parser.parse_args()


def main():
    args = parse_args()
    logger.info(f"Starting Job Automation Run (Mode: {args.mode}, City: {args.city or 'ALL'}, Source: {args.source or 'ALL'})")
    
    summary = {
        "started_at": datetime.now().isoformat(),
        "mode": args.mode,
        "city": args.city,
        "source": args.source,
        "jobspy": None,
        "telegram": None,
        "errors": []
    }
    
    # 1. Run JobSpy Collector (if requested and not telegram-only)
    if args.mode in ["all", "jobspy"]:
        if args.source and args.source.lower() == "telegram":
            logger.info("Skipping JobSpy because source is set to telegram.")
        else:
            try:
                logger.info("Executing JobSpy collector...")
                jobspy_result = run_jobspy_collector(target_city_slug=args.city, target_source=args.source)
                summary["jobspy"] = jobspy_result
            except Exception as e:
                logger.error(f"JobSpy execution failed: {e}")
                summary["errors"].append({"collector": "jobspy", "error": str(e)})
                
    # 2. Run Telegram Collector (if requested and not jobspy-only)
    if args.mode in ["all", "telegram"]:
        if args.source and args.source.lower() not in ["telegram", "all"]:
            logger.info(f"Skipping Telegram collector because source is set to {args.source}.")
        else:
            try:
                logger.info("Executing Telegram collector...")
                telegram_result = asyncio.run(run_telegram_collector())
                summary["telegram"] = telegram_result
            except Exception as e:
                logger.error(f"Telegram execution failed: {e}")
                summary["errors"].append({"collector": "telegram", "error": str(e)})
                
    summary["completed_at"] = datetime.now().isoformat()
    logger.info("Job Automation run completed.")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
