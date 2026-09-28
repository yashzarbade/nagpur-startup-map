import type { NormalizedJob } from "./types";

/**
 * Greenhouse Job Board API response types (public, no auth required).
 * Reference: https://developer.greenhouse.io/job-board.html
 */
interface GreenhouseJob {
  id: number;
  title: string;
  updated_at: string;
  absolute_url: string;
  location: {
    name: string;
  };
  departments: Array<{ name: string }>;
  content: string; // HTML description
  metadata?: Array<{
    id: number;
    name: string;
    value: string | string[] | null;
    value_type: string;
  }>;
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
}

/**
 * Fetch jobs from Greenhouse public Job Board API.
 * @param boardToken - The company's Greenhouse board token (e.g., "gitlab")
 */
export async function fetchGreenhouseJobs(boardToken: string): Promise<NormalizedJob[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "NagpurStartupMap/1.0 (job-aggregator)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Greenhouse API error: ${response.status} ${response.statusText}`);
  }

  const data: GreenhouseResponse = await response.json();

  if (!data.jobs || !Array.isArray(data.jobs)) {
    return [];
  }

  return data.jobs.map((job) => normalizeGreenhouseJob(job, boardToken));
}

function normalizeGreenhouseJob(job: GreenhouseJob, boardToken: string): NormalizedJob {
  const locationName = job.location?.name ?? null;
  const remoteType = detectRemoteType(locationName, job.title);
  const department = job.departments?.[0]?.name ?? null;

  // Strip HTML tags for plain text description
  const description = job.content
    ? job.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    : null;

  return {
    title: job.title,
    description,
    location: locationName,
    remoteType,
    employmentType: detectEmploymentType(job.title, description),
    applicationUrl: job.absolute_url,
    sourceUrl: job.absolute_url,
    sourceType: "GREENHOUSE",
    externalJobId: String(job.id),
    department,
    postedAt: job.updated_at ? new Date(job.updated_at) : null,
    skills: null,
    salaryMin: null,
    salaryMax: null,
    currency: null,
  };
}

function detectRemoteType(
  location: string | null,
  title: string
): "ON_SITE" | "REMOTE" | "HYBRID" | null {
  const text = `${location ?? ""} ${title}`.toLowerCase();
  if (text.includes("remote")) return "REMOTE";
  if (text.includes("hybrid")) return "HYBRID";
  if (location) return "ON_SITE";
  return null;
}

function detectEmploymentType(
  title: string,
  description: string | null
): "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE" | null {
  const text = `${title} ${description ?? ""}`.toLowerCase();
  if (text.includes("intern")) return "INTERNSHIP";
  if (text.includes("contract") || text.includes("contractor")) return "CONTRACT";
  if (text.includes("part-time") || text.includes("part time")) return "PART_TIME";
  if (text.includes("freelance")) return "FREELANCE";
  // Default: most ATS postings are full-time
  return "FULL_TIME";
}
