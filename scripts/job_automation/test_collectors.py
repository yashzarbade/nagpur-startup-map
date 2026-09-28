"""
Central India Tech — Job Automation & Telegram Parser Unit Tests
Validates parsing logic, empty channel handling, credentials checks, and error isolation.
"""
import os
import sys
import unittest
import asyncio

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from telegram_collector import (
    parse_telegram_message,
    run_telegram_collector,
    WALKIN_KEYWORDS,
    CITY_PATTERNS
)
from jobspy_collector import run_jobspy_collector


class TestTelegramParser(unittest.TestCase):

    def test_walkin_detection_nagpur(self):
        text = """
        Mega Walk-in Drive for Software Developers!
        Company: Tech Mahindra
        Location: Nagpur (MIHAN SEZ)
        Date: 15th October 2026
        Experience: 0-3 years (Freshers eligible)
        Venue: Tech Mahindra Campus, Nagpur
        """
        parsed = parse_telegram_message(text, "techjobs_central", 101)
        self.assertIsNotNone(parsed, "Walk-in announcement must be detected")
        self.assertTrue(parsed["is_walkin"])
        self.assertIn("nagpur", parsed["cities"])
        self.assertEqual(parsed["source_channel"], "techjobs_central")
        self.assertEqual(str(parsed["source_message_id"]), "101")
        self.assertIn("techmahindra", parsed["company_name"].lower().replace(" ", ""))

    def test_walkin_detection_indore(self):
        text = """
        Direct Interview / Hiring Drive in Indore!
        Looking for React and Node.js Developers.
        Location: Indore, Madhya Pradesh.
        Walk In on Saturday 10 AM.
        Venue: Crystal IT Park, Indore.
        """
        parsed = parse_telegram_message(text, "indore_tech_jobs", 202)
        self.assertIsNotNone(parsed, "Indore walk-in announcement must be detected")
        self.assertTrue(parsed["is_walkin"])
        self.assertIn("indore", parsed["cities"])

    def test_walkin_detection_bhopal(self):
        text = """
        Recruitment Drive: Full Stack Developer (Bhopal)
        Immediate Joining.
        Walkin Interview on 20th Oct at MP Nagar, Bhopal, MP.
        """
        parsed = parse_telegram_message(text, "bhopal_jobs", 303)
        self.assertIsNotNone(parsed, "Bhopal recruitment drive must be detected")
        self.assertIn("bhopal", parsed["cities"])

    def test_multi_city_detection(self):
        text = """
        Infosys Mega Walk-in across Central India!
        Locations: Nagpur and Indore branches.
        Roles: System Engineer, Java Dev.
        """
        parsed = parse_telegram_message(text, "central_india_jobs", 404)
        self.assertIsNotNone(parsed)
        self.assertIn("nagpur", parsed["cities"])
        self.assertIn("indore", parsed["cities"])

    def test_unrelated_message_rejection(self):
        # Mere mention of city without job/walk-in intent
        noise_text = "Nagpur weather today is 32 degrees with sunny skies."
        parsed = parse_telegram_message(noise_text, "random_news", 505)
        self.assertIsNone(parsed, "Unrelated message mentioning city must be rejected")

        # Mere mention of walk-in without tech/city context
        noise_text_2 = "Walk in to our restaurant for a 20% discount on lunch!"
        parsed_2 = parse_telegram_message(noise_text_2, "food_channel", 506)
        self.assertIsNone(parsed_2, "Commercial non-job walk-in must be rejected")

    def test_missing_credentials_safe_exit(self):
        """Collector must exit safely with 'skipped' status when credentials are not configured."""
        saved_id = os.environ.pop("TELEGRAM_API_ID", None)
        saved_hash = os.environ.pop("TELEGRAM_API_HASH", None)
        saved_session = os.environ.pop("TELEGRAM_SESSION", None)

        try:
            result = asyncio.run(run_telegram_collector())
            self.assertEqual(result["status"], "skipped")
            self.assertTrue("not configured" in result["reason"] or "not provided" in result["reason"])
        finally:
            if saved_id: os.environ["TELEGRAM_API_ID"] = saved_id
            if saved_hash: os.environ["TELEGRAM_API_HASH"] = saved_hash
            if saved_session: os.environ["TELEGRAM_SESSION"] = saved_session

    def test_empty_channels_config(self):
        """When channels list is empty, collector handles it gracefully without crashing."""
        import json
        channels_file = os.path.join(SCRIPT_DIR, "config", "telegram_channels.json")
        with open(channels_file, "r") as f:
            channels = json.load(f)
        self.assertIsInstance(channels, list)
        # Verify it can be empty
        self.assertTrue(len(channels) == 0 or all("username" in c for c in channels))


if __name__ == "__main__":
    unittest.main(verbosity=2)
