import { cn } from "cn";

export { cn };

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Format a number with Indian numbering system
 */
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString("en-IN");
}

/**
 * Format salary range in INR
 */
export function formatSalary(min?: number | null, max?: number | null, currency = "INR"): string {
  if (!min && !max) return "Not disclosed";
  const fmt = (n: number) => {
    if (currency === "INR") return `₹${formatIndianNumber(n)}`;
    return `${currency} ${n.toLocaleString()}`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  if (max) return `Up to ${fmt(max)}`;
  return "Not disclosed";
}

/**
 * Format experience range
 */
export function formatExperience(min?: number | null, max?: number | null): string {
  if (min === 0 && !max) return "Fresher";
  if (min === 0 && max) return `0–${max} years`;
  if (min && max) return `${min}–${max} years`;
  if (min) return `${min}+ years`;
  if (max) return `Up to ${max} years`;
  return "Any experience";
}

/**
 * Get relative time string (e.g., "Posted 2 days ago", "Posted today")
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted yesterday";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Posted ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Posted ${months} ${months === 1 ? "month" : "months"} ago`;
  }
  return `Posted over a year ago`;
}

/**
 * Get freshness level for job badges
 */
export function getFreshnessLevel(date: Date | string): "new" | "recent" | "aging" | "old" {
  const d = new Date(date);
  const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return "new";
  if (diffDays <= 7) return "recent";
  if (diffDays <= 14) return "aging";
  return "old";
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a date for short display (e.g., "Sep 2026")
 */
export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short" });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/**
 * Normalize a company name for duplicate detection
 */
export function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\b(pvt|private|ltd|limited|inc|llp|llc|technologies|tech|solutions|software)\b\.?/g, "")
    .replace(/[^\w]/g, "")
    .trim();
}

/**
 * Check if a job is expired
 */
export function isJobExpired(expiresAt: Date | string | null, postedAt: Date | string): boolean {
  if (expiresAt) return new Date(expiresAt) < new Date();
  const posted = new Date(postedAt);
  posted.setDate(posted.getDate() + 30);
  return posted < new Date();
}

// ─── URL generators ─────────────────────────────────────────────────

export const companyUrl = (slug: string, citySlug: string = "nagpur") => `/${citySlug}/company/${slug}`;
export const jobUrl = (slug: string, citySlug: string = "nagpur") => `/${citySlug}/job/${slug}`;
export const eventUrl = (slug: string, citySlug: string = "nagpur") => `/${citySlug}/event/${slug}`;
export const founderUrl = (slug: string, citySlug: string = "nagpur") => `/${citySlug}/founder/${slug}`;
export const talentUrl = (slug: string) => `/talent/${slug}`;
export const sectorUrl = (slug: string, citySlug: string = "nagpur") => `/${citySlug}/startups/${slug}`;
export const areaUrl = (slug: string, citySlug: string = "nagpur") => `/${citySlug}/areas/${slug}`;

