import type { NormalizedJob } from "./types";

/**
 * Workable public API response types.
 */
interface WorkableJob {
  id: string;
  title: string;
  shortlink: string;
  url: string;
  application_url?: string;
  department?: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  telecommuting?: boolean; // Remote
  employment_type?: string;
  published_on?: string;
}

interface WorkableResponse {
  results: WorkableJob[];
}

/**
 * Fetch jobs from Workable public Jobs API.
 * @param subdomain - The company's Workable subdomain
 */
export async function fetchWorkableJobs(subdomain: string): Promise<NormalizedJob[]> {
  const url = `https://apply.workable.com/api/v3/accounts/${encodeURIComponent(subdomain)}/jobs`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "CentralIndiaTech/1.0 (job-aggregator)",
    },
    body: JSON.stringify({ query: "" }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Workable API error: ${response.status} ${response.statusText}`);
  }

  const data: WorkableResponse = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((j) => normalizeWorkableJob(j, subdomain));
}

function normalizeWorkableJob(job: WorkableJob, subdomain: string): NormalizedJob {
  const locParts = [job.location?.city, job.location?.region, job.location?.country].filter(Boolean);
  const location = locParts.length > 0 ? locParts.join(", ") : null;

  let remoteType: NormalizedJob["remoteType"] = null;
  if (job.telecommuting) remoteType = "REMOTE";
  else if (location) remoteType = "ON_SITE";

  let employmentType: NormalizedJob["employmentType"] = "FULL_TIME";
  const et = (job.employment_type || "").toLowerCase();
  if (et.includes("intern")) employmentType = "INTERNSHIP";
  else if (et.includes("part_time") || et.includes("part-time")) employmentType = "PART_TIME";
  else if (et.includes("contract")) employmentType = "CONTRACT";
  else if (et.includes("freelance")) employmentType = "FREELANCE";

  const appUrl = job.application_url || job.url || `https://apply.workable.com/${subdomain}/j/${job.shortlink}/`;

  return {
    title: job.title,
    description: null,
    location,
    remoteType,
    employmentType,
    applicationUrl: appUrl,
    sourceUrl: appUrl,
    sourceType: "WORKABLE",
    externalJobId: job.shortlink || job.id,
    department: job.department || null,
    postedAt: job.published_on ? new Date(job.published_on) : null,
    skills: null,
    salaryMin: null,
    salaryMax: null,
    currency: null,
  };
}
