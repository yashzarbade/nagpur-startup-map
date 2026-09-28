import type { NormalizedJob } from "./types";

/**
 * Lever public Postings API response (no auth required).
 * Reference: https://github.com/lever/postings-api
 */
interface LeverPosting {
  id: string;
  text: string; // Job title
  createdAt: number;
  descriptionPlain: string;
  hostedUrl: string;
  applyUrl: string;
  categories: {
    commitment?: string; // "Full-time", "Part-time", "Intern"
    department?: string;
    team?: string;
    location?: string;
  };
  workplaceType?: string; // "remote", "hybrid", "on-site"
  salaryDescription?: string;
}

/**
 * Fetch jobs from Lever public Postings API.
 * @param site - Company's Lever site name (e.g., "netflix")
 */
export async function fetchLeverJobs(site: string): Promise<NormalizedJob[]> {
  const url = `https://api.lever.co/v0/postings/${encodeURIComponent(site)}?mode=json`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "CentralIndiaTech/1.0 (job-aggregator)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Lever API error: ${response.status} ${response.statusText}`);
  }

  const postings: LeverPosting[] = await response.json();

  if (!Array.isArray(postings)) {
    return [];
  }

  return postings.map((p) => normalizeLeverJob(p, site));
}

function normalizeLeverJob(posting: LeverPosting, site: string): NormalizedJob {
  const location = posting.categories?.location ?? null;
  const commitment = (posting.categories?.commitment ?? "").toLowerCase();

  let employmentType: NormalizedJob["employmentType"] = "FULL_TIME";
  if (commitment.includes("intern")) employmentType = "INTERNSHIP";
  else if (commitment.includes("part-time") || commitment.includes("part time")) employmentType = "PART_TIME";
  else if (commitment.includes("contract")) employmentType = "CONTRACT";
  else if (commitment.includes("freelance")) employmentType = "FREELANCE";

  let remoteType: NormalizedJob["remoteType"] = null;
  const workplace = (posting.workplaceType || "").toLowerCase();
  const textCheck = `${location ?? ""} ${posting.text}`.toLowerCase();
  if (workplace === "remote" || textCheck.includes("remote")) remoteType = "REMOTE";
  else if (workplace === "hybrid" || textCheck.includes("hybrid")) remoteType = "HYBRID";
  else if (workplace === "on-site" || location) remoteType = "ON_SITE";

  return {
    title: posting.text,
    description: posting.descriptionPlain || null,
    location,
    remoteType,
    employmentType,
    applicationUrl: posting.applyUrl || posting.hostedUrl,
    sourceUrl: posting.hostedUrl,
    sourceType: "LEVER",
    externalJobId: posting.id,
    department: posting.categories?.department || posting.categories?.team || null,
    postedAt: posting.createdAt ? new Date(posting.createdAt) : null,
    skills: null,
    salaryMin: null,
    salaryMax: null,
    currency: null,
  };
}
