import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import {
  submissions,
  claims,
  savedJobs,
  savedCompanies,
  notifications,
  jobs,
  companies,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Manage your Central India Tech submissions, bookmarks, and profile.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user, profile } = await requireAuth("/dashboard");
  const params = await searchParams;
  const initialTab = (params?.tab as string) || "overview";

  // Fetch user's submissions
  const userSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.userId, user.id))
    .orderBy(desc(submissions.createdAt));

  // Fetch user's claims
  const userClaims = await db
    .select()
    .from(claims)
    .where(eq(claims.userId, user.id))
    .orderBy(desc(claims.createdAt));

  // Fetch user's saved jobs with company details
  const userSavedJobs = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      companyName: companies.name,
      companySlug: companies.slug,
      companyLogo: companies.logoUrl,
      location: jobs.location,
      remoteType: jobs.remoteType,
      status: jobs.status,
      expiresAt: jobs.expiresAt,
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(savedJobs.userId, user.id));

  // Active saved jobs only
  const activeSavedJobs = userSavedJobs.filter(
    (j) =>
      j.status === "ACTIVE" &&
      (!j.expiresAt || new Date(j.expiresAt) > new Date())
  );

  // Fetch user's saved companies
  const userSavedCompanies = await db
    .select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      logoUrl: companies.logoUrl,
      sector: companies.sector,
      locationName: companies.locationName,
    })
    .from(savedCompanies)
    .innerJoin(companies, eq(savedCompanies.companyId, companies.id))
    .where(eq(savedCompanies.userId, user.id));

  // Fetch user's notifications
  const userNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(20);

  return (
    <DashboardClient
      profile={profile}
      submissions={userSubmissions}
      claims={userClaims}
      savedJobs={activeSavedJobs}
      savedCompanies={userSavedCompanies}
      notifications={userNotifications}
      initialTab={initialTab}
    />
  );
}
