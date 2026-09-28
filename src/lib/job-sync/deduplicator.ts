import { db } from "@/db";
import { jobs, companies } from "@/db/schema";
import { and, eq, or, ilike } from "drizzle-orm";
import type { NormalizedJob } from "./types";
import { normalizeTitle, normalizeLocation, normalizeUrl } from "./normalizer";
import { slugify } from "@/lib/utils";

/**
 * Result of a deduplication check for a single job.
 */
export interface DeduplicationResult {
  isDuplicate: boolean;
  existingJobId: number | null;
  matchType?: "source_job_id" | "dedup_key" | "canonical_url" | "title_location" | null;
}

/**
 * Generate a deterministic deduplication key for a job.
 */
export function generateDeduplicationKey(
  title: string,
  companyName: string,
  cityId?: number | null,
  walkinDate?: Date | null
): string {
  const normTitle = slugify(normalizeTitle(title));
  const normCompany = slugify(companyName.trim().toLowerCase());
  const city = cityId ? `c${cityId}` : "c0";
  const dateStr = walkinDate ? `d${walkinDate.toISOString().slice(0, 10)}` : "";
  return `${normCompany}:${normTitle}:${city}${dateStr ? ":" + dateStr : ""}`.slice(0, 255);
}

/**
 * Find or safely create a company stub in the companies table.
 * Ensures referential integrity with foreign key `jobs.companyId`.
 */
export async function resolveOrCreateCompany(
  companyName: string,
  cityId: number = 1,
  websiteUrl?: string | null
): Promise<{ id: number; name: string; slug: string }> {
  const cleanName = companyName.trim() || "Independent / Direct Recruiter";
  const baseSlug = slugify(cleanName);

  // 1. Try finding company by slug or name
  const [existing] = await db
    .select({ id: companies.id, name: companies.name, slug: companies.slug })
    .from(companies)
    .where(or(eq(companies.slug, baseSlug), ilike(companies.name, cleanName)))
    .limit(1);

  if (existing) {
    return existing;
  }

  // 2. Safe upsert company stub
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  const [created] = await db
    .insert(companies)
    .values({
      name: cleanName,
      slug: uniqueSlug,
      cityId,
      websiteUrl: websiteUrl || null,
      verificationStatus: "PENDING",
      hiring: true,
      descriptionShort: `${cleanName} hiring in Central India.`,
    })
    .returning({ id: companies.id, name: companies.name, slug: companies.slug });

  return created;
}

/**
 * Check if a job already exists in the database using multi-tier deduplication.
 *
 * Priority:
 * 1. source_type + (source_job_id OR external_job_id)
 * 2. deduplication_key (deterministic company + title + city)
 * 3. Canonical application_url (URL-normalized)
 * 4. company_id + normalized title + location (fuzzy fallback)
 */
export async function findExistingJob(
  job: NormalizedJob,
  companyId: number
): Promise<DeduplicationResult> {
  const externalId = job.sourceJobId || job.externalJobId;

  // Tier 1: source_type + external/source job id
  if (externalId && job.sourceType) {
    const [existing] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(
        and(
          eq(jobs.sourceType, job.sourceType as any),
          or(
            eq(jobs.externalJobId, externalId),
            eq(jobs.sourceJobId, externalId)
          )
        )
      )
      .limit(1);

    if (existing) {
      return { isDuplicate: true, existingJobId: existing.id, matchType: "source_job_id" };
    }
  }

  // Tier 2: deduplication_key
  const dedupKey =
    job.sourceChannel && job.sourceMessageId
      ? `telegram:${job.sourceChannel}:${job.sourceMessageId}`
      : generateDeduplicationKey(
          job.title,
          job.companyName || "company",
          job.cityId || 1,
          job.walkinDate
        );

  const [byKey] = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(eq(jobs.deduplicationKey, dedupKey))
    .limit(1);

  if (byKey) {
    return { isDuplicate: true, existingJobId: byKey.id, matchType: "dedup_key" };
  }

  // Tier 3: canonical application URL
  if (job.applicationUrl && job.applicationUrl.startsWith("http")) {
    const normalizedAppUrl = normalizeUrl(job.applicationUrl);
    const existingCandidates = await db
      .select({ id: jobs.id, applicationUrl: jobs.applicationUrl })
      .from(jobs)
      .where(eq(jobs.companyId, companyId))
      .limit(50);

    for (const row of existingCandidates) {
      if (row.applicationUrl && normalizeUrl(row.applicationUrl) === normalizedAppUrl) {
        return { isDuplicate: true, existingJobId: row.id, matchType: "canonical_url" };
      }
    }
  }

  // Tier 4: company + normalized title + location
  const normTitle = normalizeTitle(job.title);
  const normLoc = normalizeLocation(job.location);

  const candidateJobs = await db
    .select({ id: jobs.id, title: jobs.title, location: jobs.location })
    .from(jobs)
    .where(eq(jobs.companyId, companyId));

  for (const candidate of candidateJobs) {
    if (
      normalizeTitle(candidate.title) === normTitle &&
      (!normLoc || normalizeLocation(candidate.location) === normLoc)
    ) {
      return { isDuplicate: true, existingJobId: candidate.id, matchType: "title_location" };
    }
  }

  return { isDuplicate: false, existingJobId: null };
}

