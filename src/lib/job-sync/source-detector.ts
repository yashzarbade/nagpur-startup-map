import type { DetectedSource, JobSourceType } from "./types";

/**
 * URL patterns for known ATS providers.
 */
const GREENHOUSE_PATTERNS = [
  /boards\.greenhouse\.io\/(\w+)/i,
  /job-boards\.greenhouse\.io\/(\w+)/i,
  /(\w+)\.greenhouse\.io/i,
];

const ASHBY_PATTERNS = [
  /jobs\.ashbyhq\.com\/(\w[\w-]*)/i,
];

const LEVER_PATTERNS = [
  /jobs\.lever\.co\/([\w-]+)/i,
];

const WORKABLE_PATTERNS = [
  /apply\.workable\.com\/([\w-]+)/i,
];

/**
 * Detect the job source type and identifier from a careers URL.
 * Returns { sourceType, identifier } where identifier is the board token/name.
 */
export function detectSource(careersUrl: string): DetectedSource {
  if (!careersUrl) {
    return { sourceType: "MANUAL", identifier: null };
  }

  const url = careersUrl.trim();

  // Check Greenhouse patterns
  for (const pattern of GREENHOUSE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const token = match[1].toLowerCase();
      if (token === "www" || token === "support" || token === "help") continue;
      return { sourceType: "GREENHOUSE", identifier: match[1] };
    }
  }

  // Check Ashby patterns
  for (const pattern of ASHBY_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { sourceType: "ASHBY", identifier: match[1] };
    }
  }

  // Check Lever patterns
  for (const pattern of LEVER_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { sourceType: "LEVER", identifier: match[1] };
    }
  }

  // Check Workable patterns
  for (const pattern of WORKABLE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { sourceType: "WORKABLE", identifier: match[1] };
    }
  }

  // Default: attempt generic careers page scraping
  return { sourceType: "GENERIC_CAREERS_PAGE", identifier: null };
}

/**
 * Check if a source type is an authoritative ATS feed (safe to expire on missing).
 */
export function isAuthoritativeSource(sourceType: JobSourceType): boolean {
  return (
    sourceType === "GREENHOUSE" ||
    sourceType === "ASHBY" ||
    sourceType === "LEVER" ||
    sourceType === "WORKABLE"
  );
}
