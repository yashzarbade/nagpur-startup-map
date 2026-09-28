import { db } from "@/db";
import { companies, jobs, jobSyncRuns } from "@/db/schema";
import { eq, and, desc, inArray, ne } from "drizzle-orm";
import type {
  SyncableCompany,
  SyncRunResult,
  CompanySyncResult,
  NormalizedJob,
  JobSourceType,
} from "./types";
import { detectSource, isAuthoritativeSource } from "./source-detector";
import { fetchGreenhouseJobs } from "./greenhouse";
import { fetchAshbyJobs } from "./ashby";
import { fetchLeverJobs } from "./lever";
import { fetchWorkableJobs } from "./workable";
import { fetchGenericCareersJobs } from "./generic-scraper";
import { normalizeJobs, generateJobSlug } from "./normalizer";
import {
  findExistingJob,
  generateDeduplicationKey,
  resolveOrCreateCompany,
} from "./deduplicator";
import { lt } from "drizzle-orm";

const MAX_RETRIES = 3;
const BATCH_SIZE = 5;

/**
 * Main sync orchestrator.
 * Fetches jobs from all configured companies, normalizes, deduplicates,
 * and upserts into the database.
 */
export async function runJobSync(
  triggeredBy: "CRON" | "MANUAL" = "CRON"
): Promise<SyncRunResult> {
  // ─── Acquire lock ─────────────────────────────────────────────────────
  const activeLock = await db
    .select({ id: jobSyncRuns.id })
    .from(jobSyncRuns)
    .where(eq(jobSyncRuns.status, "RUNNING"))
    .limit(1);

  if (activeLock.length > 0) {
    throw new Error("A sync job is already running. Please wait for it to complete.");
  }

  // Create sync run record
  const [syncRun] = await db
    .insert(jobSyncRuns)
    .values({
      triggeredBy,
      status: "RUNNING",
    })
    .returning({ id: jobSyncRuns.id });

  const result: SyncRunResult = {
    companiesChecked: 0,
    jobsFound: 0,
    jobsCreated: 0,
    jobsUpdated: 0,
    jobsExpired: 0,
    errors: 0,
    details: [],
  };

  const errorLog: Array<{ companyId: number; companyName: string; error: string }> = [];

  try {
    // ─── Load syncable companies ──────────────────────────────────────────
    const syncableCompanies = await loadSyncableCompanies();

    // ─── Process in batches ───────────────────────────────────────────────
    for (let i = 0; i < syncableCompanies.length; i += BATCH_SIZE) {
      const batch = syncableCompanies.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.allSettled(
        batch.map((company) => syncCompany(company))
      );

      for (const batchResult of batchResults) {
        if (batchResult.status === "fulfilled") {
          const companyResult = batchResult.value;
          result.companiesChecked++;
          result.jobsFound += companyResult.jobsFound;
          result.jobsCreated += companyResult.jobsCreated;
          result.jobsUpdated += companyResult.jobsUpdated;
          result.jobsExpired += companyResult.jobsExpired;
          result.details.push(companyResult);

          if (!companyResult.success) {
            result.errors++;
            errorLog.push({
              companyId: companyResult.companyId,
              companyName: companyResult.companyName,
              error: companyResult.error ?? "Unknown error",
            });
          }
        } else {
          result.errors++;
          errorLog.push({
            companyId: 0,
            companyName: "Unknown",
            error: batchResult.reason?.message ?? "Batch processing error",
          });
        }
      }

      // Small delay between batches to be respectful
      if (i + BATCH_SIZE < syncableCompanies.length) {
        await sleep(500);
      }
    }

    // ─── Expire outdated walk-ins ─────────────────────────────────────────
    const walkinsExpired = await expirePassedWalkins();
    result.jobsExpired += walkinsExpired;

    // ─── Finalize sync run ────────────────────────────────────────────────
    const finalStatus = result.errors === 0 ? "SUCCESS" :
      result.errors < result.companiesChecked ? "PARTIAL" : "FAILED";

    await db
      .update(jobSyncRuns)
      .set({
        completedAt: new Date(),
        status: finalStatus,
        companiesChecked: result.companiesChecked,
        jobsFound: result.jobsFound,
        jobsCreated: result.jobsCreated,
        jobsUpdated: result.jobsUpdated,
        jobsExpired: result.jobsExpired,
        errors: result.errors,
        errorLog: errorLog.length > 0 ? errorLog : null,
      })
      .where(eq(jobSyncRuns.id, syncRun.id));

    return result;
  } catch (error) {
    // Mark sync as failed
    await db
      .update(jobSyncRuns)
      .set({
        completedAt: new Date(),
        status: "FAILED",
        errors: result.errors + 1,
        errorLog: [...errorLog, {
          companyId: 0,
          companyName: "System",
          error: error instanceof Error ? error.message : "Unknown error",
        }],
      })
      .where(eq(jobSyncRuns.id, syncRun.id));

    throw error;
  }
}

/**
 * Load companies that are eligible for job syncing.
 */
async function loadSyncableCompanies(): Promise<SyncableCompany[]> {
  const rows = await db
    .select({
      id: companies.id,
      cityId: companies.cityId,
      name: companies.name,
      slug: companies.slug,
      careersUrl: companies.careersUrl,
      jobSourceType: companies.jobSourceType,
      jobSourceIdentifier: companies.jobSourceIdentifier,
    })
    .from(companies)
    .where(
      and(
        // Only companies with a careers URL
        ne(companies.careersUrl, ""),
        // Exclude MANUAL source type — they're managed by admins
        // (null source type means not yet detected, so include those)
      )
    );

  return rows.filter(
    (r): r is SyncableCompany =>
      r.careersUrl !== null && r.careersUrl.trim().length > 0 &&
      r.jobSourceType !== "MANUAL"
  );
}

/**
 * Sync jobs for a single company.
 */
async function syncCompany(company: SyncableCompany): Promise<CompanySyncResult> {
  const now = new Date();

  // Auto-detect source type if not set
  let sourceType = company.jobSourceType;
  let identifier = company.jobSourceIdentifier;

  if (!sourceType) {
    const detected = detectSource(company.careersUrl);
    sourceType = detected.sourceType;
    identifier = detected.identifier;

    // Persist detection
    await db
      .update(companies)
      .set({
        jobSourceType: sourceType,
        jobSourceIdentifier: identifier,
      })
      .where(eq(companies.id, company.id));
  }

  const result: CompanySyncResult = {
    companyId: company.id,
    companyName: company.name,
    sourceType: sourceType,
    success: false,
    jobsFound: 0,
    jobsCreated: 0,
    jobsUpdated: 0,
    jobsExpired: 0,
  };

  try {
    // ─── Fetch jobs from source ─────────────────────────────────────────
    const rawJobs = await fetchWithRetry(
      () => fetchJobsFromSource(sourceType!, identifier, company.careersUrl),
      MAX_RETRIES
    );

    // ─── Normalize ──────────────────────────────────────────────────────
    const normalizedJobs = normalizeJobs(rawJobs);
    result.jobsFound = normalizedJobs.length;

    // ─── Track which external IDs were seen in this sync ────────────────
    const seenExternalIds = new Set<string>();

    // ─── Upsert jobs ────────────────────────────────────────────────────
    for (const job of normalizedJobs) {
      const dedup = await findExistingJob(job, company.id);

      if (dedup.isDuplicate && dedup.existingJobId) {
        // Update existing job
        await db
          .update(jobs)
          .set({
            title: job.title,
            description: job.description,
            location: job.location,
            remoteType: job.remoteType,
            employmentType: job.employmentType,
            applicationUrl: job.applicationUrl,
            sourceUrl: job.sourceUrl,
            department: job.department,
            skills: job.skills,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            currency: job.currency,
            lastSeenAt: now,
            lastCheckedAt: now,
            missedSyncCount: 0,
            status: "ACTIVE", // Re-activate if it was expired
            updatedAt: now,
          })
          .where(eq(jobs.id, dedup.existingJobId));

        result.jobsUpdated++;
      } else {
        // Create new job
        const slug = generateJobSlug(job.title, company.slug, job.externalJobId);
        const dedupKey = generateDeduplicationKey(job.title, company.name, company.cityId ?? 1);

        await db.insert(jobs).values({
          companyId: company.id,
          cityId: company.cityId ?? 1,
          title: job.title,
          slug,
          description: job.description,
          location: job.location,
          remoteType: job.remoteType,
          employmentType: job.employmentType,
          applicationUrl: job.applicationUrl,
          sourceUrl: job.sourceUrl,
          sourceType: job.sourceType,
          externalJobId: job.externalJobId,
          sourceJobId: job.externalJobId,
          department: job.department,
          skills: job.skills,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          currency: job.currency,
          deduplicationKey: dedupKey,
          postedAt: job.postedAt ?? now,
          lastSeenAt: now,
          lastCheckedAt: now,
          missedSyncCount: 0,
          status: "ACTIVE",
        });

        result.jobsCreated++;
      }

      if (job.externalJobId) {
        seenExternalIds.add(job.externalJobId);
      }
    }

    // ─── Expire missing jobs ────────────────────────────────────────────
    const expiredCount = await expireMissingJobs(
      company.id,
      sourceType!,
      seenExternalIds,
      now
    );
    result.jobsExpired = expiredCount;

    // ─── Update company sync status ─────────────────────────────────────
    await db
      .update(companies)
      .set({
        lastJobSyncAt: now,
        lastJobSyncStatus: "SUCCESS",
        // Update hiring flag based on active jobs
        hiring: normalizedJobs.length > 0,
      })
      .where(eq(companies.id, company.id));

    result.success = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Unknown error";

    // Mark company sync as failed but DON'T expire jobs
    await db
      .update(companies)
      .set({
        lastJobSyncAt: now,
        lastJobSyncStatus: "FAILED",
      })
      .where(eq(companies.id, company.id));
  }

  return result;
}

/**
 * Fetch jobs from the appropriate source based on type.
 */
async function fetchJobsFromSource(
  sourceType: JobSourceType,
  identifier: string | null,
  careersUrl: string
): Promise<NormalizedJob[]> {
  switch (sourceType) {
    case "GREENHOUSE":
      if (!identifier) throw new Error("Greenhouse board token not configured");
      return fetchGreenhouseJobs(identifier);
    case "ASHBY":
      if (!identifier) throw new Error("Ashby board name not configured");
      return fetchAshbyJobs(identifier);
    case "LEVER":
      if (!identifier) throw new Error("Lever site name not configured");
      return fetchLeverJobs(identifier);
    case "WORKABLE":
      if (!identifier) throw new Error("Workable subdomain not configured");
      return fetchWorkableJobs(identifier);
    case "GENERIC_CAREERS_PAGE":
      return fetchGenericCareersJobs(careersUrl);
    case "MANUAL":
      return []; // Manual sources are not synced
    default:
      return [];
  }
}

/**
 * Expire jobs that are no longer present in the feed.
 *
 * For authoritative sources (Greenhouse/Ashby):
 *   Expire immediately if missing from a successful sync.
 * For generic sources:
 *   Only expire after 2+ consecutive missed syncs.
 */
async function expireMissingJobs(
  companyId: number,
  sourceType: JobSourceType,
  seenExternalIds: Set<string>,
  now: Date
): Promise<number> {
  // Get all active jobs for this company from this source type
  const activeJobs = await db
    .select({
      id: jobs.id,
      externalJobId: jobs.externalJobId,
      missedSyncCount: jobs.missedSyncCount,
      sourceType: jobs.sourceType,
    })
    .from(jobs)
    .where(
      and(
        eq(jobs.companyId, companyId),
        eq(jobs.status, "ACTIVE"),
        eq(jobs.sourceType, sourceType)
      )
    );

  let expiredCount = 0;

  for (const activeJob of activeJobs) {
    const wasSeenInSync = activeJob.externalJobId
      ? seenExternalIds.has(activeJob.externalJobId)
      : false;

    if (wasSeenInSync) {
      continue; // Job still exists, skip
    }

    if (isAuthoritativeSource(sourceType)) {
      // Authoritative source: expire immediately
      await db
        .update(jobs)
        .set({
          status: "EXPIRED",
          lastCheckedAt: now,
          updatedAt: now,
        })
        .where(eq(jobs.id, activeJob.id));

      expiredCount++;
    } else {
      // Generic source: increment missed count, expire after threshold
      const newMissedCount = (activeJob.missedSyncCount ?? 0) + 1;

      if (newMissedCount >= 2) {
        await db
          .update(jobs)
          .set({
            status: "EXPIRED",
            missedSyncCount: newMissedCount,
            lastCheckedAt: now,
            updatedAt: now,
          })
          .where(eq(jobs.id, activeJob.id));

        expiredCount++;
      } else {
        await db
          .update(jobs)
          .set({
            missedSyncCount: newMissedCount,
            lastCheckedAt: now,
          })
          .where(eq(jobs.id, activeJob.id));
      }
    }
  }

  return expiredCount;
}

/**
 * Retry a function with exponential backoff.
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error("All retries exhausted");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Automatically expire walk-in events whose interview date has passed.
 */
export async function expirePassedWalkins(): Promise<number> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const passedWalkins = await db
    .update(jobs)
    .set({
      status: "EXPIRED",
      updatedAt: now,
    })
    .where(
      and(
        eq(jobs.isWalkin, true),
        eq(jobs.status, "ACTIVE"),
        lt(jobs.walkinDate, startOfToday)
      )
    )
    .returning({ id: jobs.id });

  return passedWalkins.length;
}

/**
 * Upsert a single normalized job (called by external Python collectors, Telegram, Walk-in submissions).
 */
export async function upsertJobRecord(job: NormalizedJob): Promise<{
  action: "created" | "updated" | "skipped";
  jobId: number;
}> {
  const now = new Date();
  const cityId = job.cityId ?? 1;

  // Resolve or create company
  let companyId: number;
  let companySlug: string;

  if (job.companySlug) {
    const [c] = await db
      .select({ id: companies.id, slug: companies.slug })
      .from(companies)
      .where(eq(companies.slug, job.companySlug))
      .limit(1);
    if (c) {
      companyId = c.id;
      companySlug = c.slug;
    } else {
      const resolved = await resolveOrCreateCompany(job.companyName || "Employer", cityId);
      companyId = resolved.id;
      companySlug = resolved.slug;
    }
  } else {
    const resolved = await resolveOrCreateCompany(job.companyName || "Employer", cityId);
    companyId = resolved.id;
    companySlug = resolved.slug;
  }

  const dedupKey =
    job.sourceChannel && job.sourceMessageId
      ? `telegram:${job.sourceChannel}:${job.sourceMessageId}`
      : generateDeduplicationKey(job.title, job.companyName || "employer", cityId, job.walkinDate);

  const dedup = await findExistingJob(job, companyId);

  if (dedup.isDuplicate && dedup.existingJobId) {
    await db
      .update(jobs)
      .set({
        title: job.title,
        description: job.description || undefined,
        location: job.location || undefined,
        remoteType: job.remoteType || undefined,
        employmentType: job.employmentType || undefined,
        applicationUrl: job.applicationUrl,
        sourceUrl: job.sourceUrl || undefined,
        department: job.department || undefined,
        skills: job.skills || undefined,
        salaryMin: job.salaryMin !== null ? job.salaryMin : undefined,
        salaryMax: job.salaryMax !== null ? job.salaryMax : undefined,
        currency: job.currency || undefined,
        walkinDate: job.walkinDate || undefined,
        walkinStartTime: job.walkinStartTime || undefined,
        walkinEndTime: job.walkinEndTime || undefined,
        walkinVenue: job.walkinVenue || undefined,
        isWalkin: job.isWalkin ?? false,
        lastSeenAt: now,
        lastCheckedAt: now,
        missedSyncCount: 0,
        status: "ACTIVE",
        updatedAt: now,
      })
      .where(eq(jobs.id, dedup.existingJobId));

    return { action: "updated", jobId: dedup.existingJobId };
  }

  const slug = generateJobSlug(job.title, companySlug, job.sourceJobId || job.externalJobId);

  const [inserted] = await db
    .insert(jobs)
    .values({
      companyId,
      cityId,
      title: job.title,
      slug,
      description: job.description,
      location: job.location,
      remoteType: job.remoteType ?? "ON_SITE",
      employmentType: job.employmentType ?? "FULL_TIME",
      applicationUrl: job.applicationUrl,
      sourceUrl: job.sourceUrl,
      sourceType: job.sourceType as any,
      externalJobId: job.externalJobId || job.sourceJobId,
      sourceJobId: job.sourceJobId || job.externalJobId,
      sourceChannel: job.sourceChannel || null,
      sourceMessageId: job.sourceMessageId || null,
      department: job.department,
      skills: job.skills,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency ?? "INR",
      isWalkin: job.isWalkin ?? false,
      walkinDate: job.walkinDate || null,
      walkinStartTime: job.walkinStartTime || null,
      walkinEndTime: job.walkinEndTime || null,
      walkinVenue: job.walkinVenue || null,
      verificationStatus: job.verificationStatus ?? "PENDING",
      moderationStatus: job.moderationStatus ?? "APPROVED",
      deduplicationKey: dedupKey,
      contactDetails: job.contactDetails || null,
      postedAt: job.postedAt ?? now,
      expiresAt: job.expiresAt || null,
      lastSeenAt: now,
      lastCheckedAt: now,
      missedSyncCount: 0,
      status: "ACTIVE",
    })
    .returning({ id: jobs.id });

  return { action: "created", jobId: inserted.id };
}
