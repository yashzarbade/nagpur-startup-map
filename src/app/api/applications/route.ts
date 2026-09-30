import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobApplications, jobs, companies, notifications } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { getCurrentUser, getOrCreateProfile } from "@/lib/auth";

/**
 * GET /api/applications — Get current user's job applications
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getOrCreateProfile(user);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 401 });
    }

    const applications = await db
      .select({
        id: jobApplications.id,
        status: jobApplications.status,
        coverMessage: jobApplications.coverMessage,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
        statusChangedAt: jobApplications.statusChangedAt,
        jobId: jobs.id,
        jobTitle: jobs.title,
        jobSlug: jobs.slug,
        jobLocation: jobs.location,
        jobStatus: jobs.status,
        companyName: companies.name,
        companySlug: companies.slug,
        companyLogo: companies.logoUrl,
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(companies, eq(jobApplications.companyId, companies.id))
      .where(eq(jobApplications.userId, user.id))
      .orderBy(desc(jobApplications.createdAt));

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("[applications] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/applications — Submit a job application
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to apply for jobs" }, { status: 401 });
    }

    const profile = await getOrCreateProfile(user);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, coverMessage, resumeUrl, portfolioUrl, linkedinUrl, githubUrl } = body;

    if (!jobId || typeof jobId !== "number") {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    // Check job exists and is active
    const [job] = await db
      .select({ id: jobs.id, companyId: jobs.companyId, title: jobs.title, status: jobs.status })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status !== "ACTIVE") {
      return NextResponse.json({ error: "This job is no longer accepting applications" }, { status: 400 });
    }

    // Check for duplicate application
    const [existing] = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .where(and(eq(jobApplications.userId, user.id), eq(jobApplications.jobId, jobId)))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "You have already applied for this job" }, { status: 409 });
    }

    // Validate and sanitize inputs
    const sanitizedCover = typeof coverMessage === "string" ? coverMessage.slice(0, 5000) : null;
    const sanitizedResume = typeof resumeUrl === "string" && resumeUrl.startsWith("http") ? resumeUrl.slice(0, 1000) : null;
    const sanitizedPortfolio = typeof portfolioUrl === "string" && portfolioUrl.startsWith("http") ? portfolioUrl.slice(0, 500) : null;
    const sanitizedLinkedin = typeof linkedinUrl === "string" && linkedinUrl.includes("linkedin.com") ? linkedinUrl.slice(0, 500) : null;
    const sanitizedGithub = typeof githubUrl === "string" && githubUrl.includes("github.com") ? githubUrl.slice(0, 500) : null;

    // Create application
    const [application] = await db
      .insert(jobApplications)
      .values({
        userId: user.id,
        jobId: jobId,
        companyId: job.companyId,
        status: "APPLIED",
        coverMessage: sanitizedCover,
        resumeUrl: sanitizedResume,
        portfolioUrl: sanitizedPortfolio,
        linkedinUrl: sanitizedLinkedin,
        githubUrl: sanitizedGithub,
        applicantName: profile.fullName || null,
        applicantEmail: profile.email || null,
      })
      .returning();

    // Create notification for the user
    await db.insert(notifications).values({
      userId: user.id,
      title: "Application Submitted",
      message: `Your application for "${job.title}" has been submitted successfully.`,
      type: "APPLICATION",
      link: "/profile/applications",
    });

    return NextResponse.json({ application, message: "Application submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("[applications] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/applications — Withdraw an application
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, action } = body;

    if (!applicationId || action !== "withdraw") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify ownership
    const [app] = await db
      .select({ id: jobApplications.id, userId: jobApplications.userId, status: jobApplications.status })
      .from(jobApplications)
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (!app || app.userId !== user.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (app.status === "WITHDRAWN" || app.status === "HIRED") {
      return NextResponse.json({ error: "Cannot withdraw this application" }, { status: 400 });
    }

    // Update status
    const [updated] = await db
      .update(jobApplications)
      .set({
        status: "WITHDRAWN",
        statusChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(jobApplications.id, applicationId))
      .returning();

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error("[applications] PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
