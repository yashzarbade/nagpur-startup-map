import type { NormalizedJob } from "./types";
import { slugify } from "@/lib/utils";

/**
 * Validate and normalize a list of jobs.
 * Filters out jobs with missing critical fields.
 */
export function normalizeJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  return jobs
    .filter(isValidJob)
    .map(sanitizeJob);
}

/**
 * Check if a job has the minimum required fields.
 * Every job must have a title and a real application URL.
 */
function isValidJob(job: NormalizedJob): boolean {
  if (!job.title || job.title.trim().length === 0) return false;

  // If applicationUrl is missing, fallback to sourceUrl or walkin venue link
  if (!job.applicationUrl || job.applicationUrl.trim().length === 0) {
    if (job.sourceUrl && job.sourceUrl.trim().length > 0) {
      job.applicationUrl = job.sourceUrl.trim();
    } else if (job.isWalkin && job.walkinVenue) {
      job.applicationUrl = "https://centralindiatech.com/walkins";
    } else {
      return false;
    }
  }

  // Basic URL validation
  try {
    new URL(job.applicationUrl);
  } catch {
    if (!job.applicationUrl.startsWith("http://") && !job.applicationUrl.startsWith("https://")) {
      job.applicationUrl = `https://${job.applicationUrl}`;
      try {
        new URL(job.applicationUrl);
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Sanitize job fields for database insertion.
 */
function sanitizeJob(job: NormalizedJob): NormalizedJob {
  return {
    ...job,
    title: sanitizeText(job.title, 255),
    description: job.description ? sanitizeText(job.description, 50000) : null,
    location: job.location ? sanitizeText(job.location, 200) : null,
    department: job.department ? sanitizeText(job.department, 100) : null,
    applicationUrl: job.applicationUrl.trim(),
    sourceUrl: job.sourceUrl?.trim() ?? null,
    skills: job.skills ? sanitizeText(job.skills, 2000) : null,
    walkinVenue: job.walkinVenue ? sanitizeText(job.walkinVenue, 1000) : null,
    walkinStartTime: job.walkinStartTime ? sanitizeText(job.walkinStartTime, 50) : null,
    walkinEndTime: job.walkinEndTime ? sanitizeText(job.walkinEndTime, 50) : null,
    contactDetails: job.contactDetails ? sanitizeText(job.contactDetails, 1000) : null,
  };
}

/**
 * Remove potentially dangerous characters and truncate.
 */
function sanitizeText(text: string, maxLength: number): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Generate a unique slug for a job.
 * Format: {company-slug}-{job-title-slug}-{short-id}
 */
export function generateJobSlug(
  title: string,
  companySlug: string,
  externalJobId?: string | null
): string {
  const titleSlug = slugify(title);
  const suffix = externalJobId
    ? externalJobId.slice(-6)
    : Math.random().toString(36).slice(2, 8);
  return `${companySlug}-${titleSlug}-${suffix}`.slice(0, 300);
}

/**
 * Normalize a job title for deduplication comparison.
 * Lowercases, removes common suffixes, trims whitespace.
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s*\(.*?\)\s*/g, "") // Remove parenthetical notes
    .replace(/\s*-\s*(m|f|d|w|x|all genders?|diverse)$/i, "") // Remove gender suffixes
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalize a location string for deduplication comparison.
 */
export function normalizeLocation(location: string | null): string {
  if (!location) return "";
  return location
    .toLowerCase()
    .trim()
    .replace(/[,\s]+/g, " ")
    .trim();
}

/**
 * Normalize a URL for comparison (remove trailing slashes, query params).
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}`.replace(/\/+$/, "").toLowerCase();
  } catch {
    return url.toLowerCase().trim().replace(/\/+$/, "");
  }
}
