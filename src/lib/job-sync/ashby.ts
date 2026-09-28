import type { NormalizedJob } from "./types";

/**
 * Ashby Job Postings API response types (public, no auth required).
 * Reference: https://developers.ashbyhq.com/docs/public-job-posting-api
 */
interface AshbyJob {
  id: string;
  title: string;
  location: string;
  department: string | null;
  team: string | null;
  isListed: boolean;
  isRemote: boolean;
  workplaceType: string | null; // "Remote", "In-Office", "Hybrid"
  descriptionHtml: string | null;
  descriptionPlain: string | null;
  publishedAt: string | null;
  employmentType: string | null; // "FullTime", "PartTime", "Intern", "Contract", "Temporary"
  jobUrl: string;
  applyUrl: string;
  address?: {
    postalAddress?: {
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  };
  secondaryLocations?: Array<{
    location: string;
    address?: {
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  }>;
  compensation?: {
    compensationTierSummary?: string;
    summaryComponents?: Array<{
      compensationType: string;
      interval: string;
      currencyCode: string | null;
      minValue: number | null;
      maxValue: number | null;
    }>;
  };
}

interface AshbyResponse {
  apiVersion: string;
  jobs: AshbyJob[];
}

/**
 * Fetch jobs from Ashby public Job Postings API.
 * @param boardName - The company's Ashby board name (e.g., "Ashby")
 */
export async function fetchAshbyJobs(boardName: string): Promise<NormalizedJob[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(boardName)}?includeCompensation=true`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "NagpurStartupMap/1.0 (job-aggregator)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Ashby API error: ${response.status} ${response.statusText}`);
  }

  const data: AshbyResponse = await response.json();

  if (!data.jobs || !Array.isArray(data.jobs)) {
    return [];
  }

  // Only include listed (published) jobs
  return data.jobs
    .filter((job) => job.isListed)
    .map((job) => normalizeAshbyJob(job));
}

function normalizeAshbyJob(job: AshbyJob): NormalizedJob {
  const remoteType = mapAshbyWorkplaceType(job.workplaceType, job.isRemote);
  const employmentType = mapAshbyEmploymentType(job.employmentType);

  // Extract salary from compensation
  const salaryComponent = job.compensation?.summaryComponents?.find(
    (c) => c.compensationType === "Salary"
  );

  return {
    title: job.title,
    description: job.descriptionPlain ?? null,
    location: job.location || null,
    remoteType,
    employmentType,
    applicationUrl: job.applyUrl || job.jobUrl,
    sourceUrl: job.jobUrl,
    sourceType: "ASHBY",
    externalJobId: job.id,
    department: job.department ?? null,
    postedAt: job.publishedAt ? new Date(job.publishedAt) : null,
    skills: null,
    salaryMin: salaryComponent?.minValue ?? null,
    salaryMax: salaryComponent?.maxValue ?? null,
    currency: salaryComponent?.currencyCode ?? null,
  };
}

function mapAshbyWorkplaceType(
  workplaceType: string | null,
  isRemote: boolean
): "ON_SITE" | "REMOTE" | "HYBRID" | null {
  if (!workplaceType) {
    return isRemote ? "REMOTE" : null;
  }
  const wt = workplaceType.toLowerCase();
  if (wt === "remote") return "REMOTE";
  if (wt === "hybrid") return "HYBRID";
  if (wt === "in-office" || wt === "on-site") return "ON_SITE";
  return isRemote ? "REMOTE" : "ON_SITE";
}

function mapAshbyEmploymentType(
  employmentType: string | null
): "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE" | null {
  if (!employmentType) return null;
  const et = employmentType.toLowerCase();
  if (et === "fulltime" || et === "full-time" || et === "full_time") return "FULL_TIME";
  if (et === "parttime" || et === "part-time" || et === "part_time") return "PART_TIME";
  if (et === "contract" || et === "temporary") return "CONTRACT";
  if (et === "intern" || et === "internship") return "INTERNSHIP";
  if (et === "freelance") return "FREELANCE";
  return "FULL_TIME";
}
