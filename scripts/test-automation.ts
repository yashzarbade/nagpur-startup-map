/**
 * Central India Tech — Automation, Normalization, Expiry & SEO Regression Test Suite
 */
import { generateDeduplicationKey } from "../src/lib/job-sync/deduplicator";
import { normalizeJobs } from "../src/lib/job-sync/normalizer";
import { generateJobPostingSchema } from "../src/lib/seo/job-posting";
import { walkinSubmissionSchema } from "../src/app/submit/walkin/actions";
import { KNOWN_CITIES } from "../src/lib/cities";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n🧪 --- Central India Tech Test Suite ---\n");

  // 1. KNOWN_CITIES coverage
  console.log("Test Suite 1: Multi-City Configuration");
  const cityKeys = Object.keys(KNOWN_CITIES);
  assert(cityKeys.includes("nagpur"), "Nagpur is in KNOWN_CITIES");
  assert(cityKeys.includes("indore"), "Indore is in KNOWN_CITIES");
  assert(cityKeys.includes("bhopal"), "Bhopal is in KNOWN_CITIES");

  // 2. Deduplication Key Generation
  console.log("\nTest Suite 2: Deduplication Engine");
  const key1 = generateDeduplicationKey("Senior Software Engineer", "Persistent Systems", 1);
  const key2 = generateDeduplicationKey("senior software engineer", "Persistent Systems  ", 1);
  const keyDifferentCity = generateDeduplicationKey("Senior Software Engineer", "Persistent Systems", 3);

  assert(key1 === key2, "Normalized company, title and city generate identical deduplication key");
  assert(key1 !== keyDifferentCity, "Different cities generate distinct deduplication keys");

  // 3. Normalization Logic
  console.log("\nTest Suite 3: Job Normalization");
  const rawJobs: any[] = [
    {
      companyId: 1,
      title: "   Full Stack Developer (React / Node)   ",
      location: "Nagpur, Maharashtra",
      applicationUrl: "https://careers.infocepts.com/job/123",
      description: "Looking for experienced developer in Nagpur office.",
      sourceType: "MANUAL",
    },
    {
      companyId: 1,
      title: "Walk-In Cloud Associate",
      location: "Indore",
      applicationUrl: "",
      isWalkin: true,
      walkinVenue: "Crystal IT Park, Indore",
      sourceType: "WALKIN_SUBMISSION",
    },
    {
      companyId: 1,
      title: "", // invalid empty title
      applicationUrl: "https://example.com/job",
    },
  ];
  const normalized = normalizeJobs(rawJobs);
  assert(normalized.length === 2, "Invalid jobs (empty title) are filtered out");
  assert(normalized[0].title === "Full Stack Developer (React / Node)", "Job title trimmed and sanitized");
  assert(
    normalized[1].applicationUrl === "https://centralindiatech.com/walkins",
    "Walk-in without explicit URL falls back to walk-in portal URL"
  );

  // 4. Schema.org JobPosting Generation & Suppression on Expiry
  console.log("\nTest Suite 4: SEO JobPosting Structured Data");
  const futureExpiry = new Date();
  futureExpiry.setDate(futureExpiry.getDate() + 30);

  const activeJob: any = {
    title: "AI Engineer",
    description: "Build cutting-edge LLM agents in Indore.",
    status: "ACTIVE",
    employmentType: "FULL_TIME",
    location: "Indore",
    companyName: "Impetus Technologies",
    cityName: "Indore",
    stateName: "Madhya Pradesh",
    postedAt: new Date(),
    expiresAt: futureExpiry,
    salaryMin: 1500000,
    salaryMax: 2500000,
    currency: "INR",
  };

  const activeSchema = generateJobPostingSchema(activeJob);
  assert(activeSchema !== null, "Active job emits valid Schema.org JobPosting LD+JSON");
  assert(activeSchema?.title === "AI Engineer", "Schema contains accurate job title");
  assert(activeSchema?.hiringOrganization?.name === "Impetus Technologies", "Schema contains hiringOrganization");
  assert(activeSchema?.baseSalary?.value?.minValue === 1500000, "Schema contains monetary salary range");

  const expiredJob: any = { ...activeJob, status: "EXPIRED" };
  const expiredSchema = generateJobPostingSchema(expiredJob);
  assert(expiredSchema === null, "Expired job strictly suppresses Schema.org JobPosting (returns null)");

  // 5. Walk-In Form Zod Validation
  console.log("\nTest Suite 5: Walk-In Public Submission Validation");
  const validSubmission = {
    companyName: "Accenture Central India",
    title: "Walk-in Drive for Cloud Engineers",
    city: "nagpur",
    venue: "MIHAN SEZ, Nagpur",
    walkinDate: "2026-10-15",
    walkinStartTime: "09:30 AM",
    walkinEndTime: "04:00 PM",
    description: "Exciting walk-in opportunity for freshers and experienced cloud engineers.",
    submitterEmail: "recruiter@accenture.com",
    applicationUrl: "https://accenture.com/careers",
  };
  const parseResultValid = walkinSubmissionSchema.safeParse(validSubmission);
  assert(parseResultValid.success, "Valid walk-in submission passes server schema validation");

  const invalidSubmission = {
    companyName: "",
    title: "Short",
    city: "invalid-city",
    venue: "",
    walkinDate: "not-a-date",
    description: "too short",
    submitterEmail: "not-an-email",
  };
  const parseResultInvalid = walkinSubmissionSchema.safeParse(invalidSubmission);
  assert(!parseResultInvalid.success, "Invalid submission fails server schema validation");
  if (!parseResultInvalid.success) {
    const errors = parseResultInvalid.error.flatten().fieldErrors;
    assert(Boolean(errors.companyName), "Fails on empty company name");
    assert(Boolean(errors.city), "Fails on unsupported city");
    assert(Boolean(errors.submitterEmail), "Fails on invalid email");
  }

  // Summary
  console.log(`\n========================================`);
  console.log(`Tests Completed: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
