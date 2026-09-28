import { NextRequest } from "next/server";
import { runJobSync } from "@/lib/job-sync";

/**
 * POST /api/jobs/sync
 *
 * Trigger a job synchronization run.
 * Requires CRON_SECRET for authentication.
 */
export async function POST(request: NextRequest) {
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

  // ─── Determine trigger type ───────────────────────────────────────────
  const triggeredBy = request.headers.get("x-triggered-by") === "manual"
    ? "MANUAL" as const
    : "CRON" as const;

  // ─── Run sync ─────────────────────────────────────────────────────────
  try {
    const result = await runJobSync(triggeredBy);

    return Response.json({
      success: true,
      companiesChecked: result.companiesChecked,
      jobsFound: result.jobsFound,
      jobsCreated: result.jobsCreated,
      jobsUpdated: result.jobsUpdated,
      jobsExpired: result.jobsExpired,
      errors: result.errors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // If it's a lock conflict, return 409
    if (message.includes("already running")) {
      return Response.json(
        { error: message },
        { status: 409 }
      );
    }

    return Response.json(
      { error: "Sync failed", message },
      { status: 500 }
    );
  }
}

// Prevent caching of this route
export const dynamic = "force-dynamic";
