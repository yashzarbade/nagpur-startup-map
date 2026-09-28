import { NextRequest } from "next/server";
import { db } from "@/db";
import { jobSyncRuns } from "@/db/schema";
import { desc } from "drizzle-orm";

/**
 * GET /api/jobs/sync/status
 *
 * Returns the latest sync run information for admin dashboard.
 * Requires CRON_SECRET for authentication.
 */
export async function GET(request: NextRequest) {
  // ─── Authenticate ─────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json(
      { error: "CRON_SECRET not configured on server" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || token !== cronSecret) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ─── Get latest sync runs ────────────────────────────────────────────
  try {
    const latestRuns = await db
      .select()
      .from(jobSyncRuns)
      .orderBy(desc(jobSyncRuns.startedAt))
      .limit(10);

    const latestRun = latestRuns[0] ?? null;

    return Response.json({
      lastSync: latestRun
        ? {
            id: latestRun.id,
            startedAt: latestRun.startedAt,
            completedAt: latestRun.completedAt,
            status: latestRun.status,
            triggeredBy: latestRun.triggeredBy,
            companiesChecked: latestRun.companiesChecked,
            jobsFound: latestRun.jobsFound,
            jobsCreated: latestRun.jobsCreated,
            jobsUpdated: latestRun.jobsUpdated,
            jobsExpired: latestRun.jobsExpired,
            errors: latestRun.errors,
            errorLog: latestRun.errorLog,
          }
        : null,
      recentRuns: latestRuns.map((run) => ({
        id: run.id,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        status: run.status,
        triggeredBy: run.triggeredBy,
        companiesChecked: run.companiesChecked,
        jobsCreated: run.jobsCreated,
        jobsUpdated: run.jobsUpdated,
        jobsExpired: run.jobsExpired,
        errors: run.errors,
      })),
      nextScheduledSync: getNextScheduledSync(),
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch sync status" },
      { status: 500 }
    );
  }
}

/**
 * Calculate the next scheduled sync time based on the 6-hour cron schedule.
 */
function getNextScheduledSync(): string {
  const now = new Date();
  const nextHour = Math.ceil(now.getUTCHours() / 6) * 6;
  const next = new Date(now);
  next.setUTCHours(nextHour >= 24 ? 0 : nextHour, 0, 0, 0);
  if (next <= now) {
    next.setUTCHours(next.getUTCHours() + 6);
  }
  return next.toISOString();
}

export const dynamic = "force-dynamic";
