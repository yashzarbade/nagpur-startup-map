import type { NormalizedJob } from "./types";

/**
 * Generic careers page scraper.
 * Extracts jobs from company careers pages via:
 * 1. JSON-LD structured data (JobPosting schema)
 * 2. Job-like link detection (low confidence, limited extraction)
 *
 * Safety rules:
 * - Never follows links off the company's own domain
 * - Never bypasses CAPTCHA/login/anti-bot systems
 * - Respects robots.txt via basic check
 * - Only publishes jobs with high-confidence extraction
 */

interface JsonLdJobPosting {
  "@type"?: string;
  title?: string;
  description?: string;
  datePosted?: string;
  validThrough?: string;
  employmentType?: string | string[];
  jobLocation?: {
    "@type"?: string;
    address?: {
      "@type"?: string;
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  } | Array<{
    "@type"?: string;
    address?: {
      "@type"?: string;
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  }>;
  hiringOrganization?: {
    name?: string;
    sameAs?: string;
  };
  url?: string;
  directApply?: boolean;
  applicantLocationRequirements?: {
    "@type"?: string;
    name?: string;
  };
  jobLocationType?: string;
  baseSalary?: {
    "@type"?: string;
    currency?: string;
    value?: {
      "@type"?: string;
      minValue?: number;
      maxValue?: number;
      unitText?: string;
    };
  };
}

/**
 * Fetch and parse jobs from a generic careers page.
 * This is best-effort: returns only high-confidence results.
 */
export async function fetchGenericCareersJobs(
  careersUrl: string
): Promise<NormalizedJob[]> {
  // Attempt to check robots.txt
  try {
    const allowed = await checkRobotsTxt(careersUrl);
    if (!allowed) {
      console.log(`[GenericScraper] robots.txt disallows: ${careersUrl}`);
      return [];
    }
  } catch {
    // If robots.txt check fails, proceed cautiously
  }

  const response = await fetch(careersUrl, {
    headers: {
      "Accept": "text/html,application/xhtml+xml",
      "User-Agent": "NagpurStartupMap/1.0 (job-aggregator; +https://nagpurstartupmap.com)",
    },
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Generic scraper error: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Strategy 1: Extract JobPosting JSON-LD (highest confidence)
  const jsonLdJobs = extractJsonLdJobs(html, careersUrl);
  if (jsonLdJobs.length > 0) {
    return jsonLdJobs;
  }

  // Strategy 2: Detect job links (lower confidence, return empty for safety)
  // For generic pages without structured data, we can't reliably extract
  // job details. Return empty rather than risk inventing jobs.
  return [];
}

/**
 * Extract JobPosting structured data from page HTML.
 */
function extractJsonLdJobs(html: string, pageUrl: string): NormalizedJob[] {
  const jobs: NormalizedJob[] = [];

  // Find all <script type="application/ld+json"> blocks
  const scriptRegex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(match[1]);
      const postings = findJobPostings(jsonData);

      for (const posting of postings) {
        const normalized = normalizeJsonLdPosting(posting, pageUrl);
        if (normalized) {
          jobs.push(normalized);
        }
      }
    } catch {
      // Invalid JSON, skip
      continue;
    }
  }

  return jobs;
}

/**
 * Recursively find JobPosting objects in JSON-LD data.
 */
function findJobPostings(data: unknown): JsonLdJobPosting[] {
  const results: JsonLdJobPosting[] = [];

  if (!data || typeof data !== "object") return results;

  if (Array.isArray(data)) {
    for (const item of data) {
      results.push(...findJobPostings(item));
    }
    return results;
  }

  const obj = data as Record<string, unknown>;

  if (obj["@type"] === "JobPosting") {
    results.push(obj as unknown as JsonLdJobPosting);
  }

  // Check @graph
  if (Array.isArray(obj["@graph"])) {
    for (const item of obj["@graph"]) {
      results.push(...findJobPostings(item));
    }
  }

  return results;
}

/**
 * Normalize a JSON-LD JobPosting to our NormalizedJob format.
 * Returns null if critical fields are missing.
 */
function normalizeJsonLdPosting(
  posting: JsonLdJobPosting,
  pageUrl: string
): NormalizedJob | null {
  // Must have at minimum a title
  if (!posting.title) return null;

  // Build location string
  let location: string | null = null;
  const jobLoc = Array.isArray(posting.jobLocation)
    ? posting.jobLocation[0]
    : posting.jobLocation;
  if (jobLoc?.address) {
    const addr = jobLoc.address;
    const parts = [addr.addressLocality, addr.addressRegion, addr.addressCountry]
      .filter(Boolean);
    location = parts.join(", ") || null;
  }

  // Determine remote type
  let remoteType: "ON_SITE" | "REMOTE" | "HYBRID" | null = null;
  if (posting.jobLocationType === "TELECOMMUTE") {
    remoteType = "REMOTE";
  } else if (location) {
    remoteType = "ON_SITE";
  }

  // Employment type
  const empType = Array.isArray(posting.employmentType)
    ? posting.employmentType[0]
    : posting.employmentType;
  const employmentType = mapJsonLdEmploymentType(empType ?? null);

  // Description: strip HTML
  const description = posting.description
    ? posting.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    : null;

  // Application URL
  const applicationUrl = posting.url || pageUrl;

  // Salary
  const salary = posting.baseSalary?.value;

  return {
    title: posting.title,
    description,
    location,
    remoteType,
    employmentType,
    applicationUrl,
    sourceUrl: pageUrl,
    sourceType: "GENERIC_CAREERS_PAGE",
    externalJobId: null, // No reliable external ID from JSON-LD
    department: null,
    postedAt: posting.datePosted ? new Date(posting.datePosted) : null,
    skills: null,
    salaryMin: salary?.minValue ?? null,
    salaryMax: salary?.maxValue ?? null,
    currency: posting.baseSalary?.currency ?? null,
  };
}

function mapJsonLdEmploymentType(
  type: string | null
): "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE" | null {
  if (!type) return null;
  const t = type.toUpperCase();
  if (t === "FULL_TIME") return "FULL_TIME";
  if (t === "PART_TIME") return "PART_TIME";
  if (t === "CONTRACT" || t === "TEMPORARY") return "CONTRACT";
  if (t === "INTERN" || t === "INTERNSHIP") return "INTERNSHIP";
  if (t === "FREELANCE") return "FREELANCE";
  return null;
}

/**
 * Basic robots.txt check for the given URL.
 */
async function checkRobotsTxt(targetUrl: string): Promise<boolean> {
  try {
    const parsedUrl = new URL(targetUrl);
    const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;

    const response = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "NagpurStartupMap/1.0",
      },
    });

    if (!response.ok) {
      // No robots.txt or error → allow
      return true;
    }

    const text = await response.text();
    const path = parsedUrl.pathname;

    // Very basic parsing: check if our path is disallowed for all agents
    const lines = text.split("\n");
    let isRelevantAgent = false;

    for (const rawLine of lines) {
      const line = rawLine.trim().toLowerCase();
      if (line.startsWith("user-agent:")) {
        const agent = line.slice("user-agent:".length).trim();
        isRelevantAgent = agent === "*" || agent.includes("nagpur");
      } else if (isRelevantAgent && line.startsWith("disallow:")) {
        const disallowed = line.slice("disallow:".length).trim();
        if (disallowed && path.startsWith(disallowed)) {
          return false;
        }
      }
    }

    return true;
  } catch {
    return true; // On error, allow
  }
}
