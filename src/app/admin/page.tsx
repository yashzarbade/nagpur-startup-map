import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import {
  submissions,
  claims,
  userProfiles,
  companies,
  jobs,
  events,
  jobSyncRuns,
  cities,
  jobSourceHealth,
} from "@/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { AdminDashboardClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin Console",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // STRICT server-side authentication and ADMIN role check.
  // Throws / redirects if unauthenticated or if profile.role !== 'ADMIN'.
  const { user, profile } = await requireAdmin();

  // Fetch real database records
  const [
    dbSubmissions,
    dbClaims,
    dbUsers,
    dbCompanies,
    dbJobs,
    dbEvents,
    dbSyncRuns,
    dbCities,
    dbSourceHealth,
  ] = await Promise.all([
    db.select().from(submissions).orderBy(desc(submissions.createdAt)).limit(100),
    db.select().from(claims).orderBy(desc(claims.createdAt)).limit(50),
    db.select().from(userProfiles).orderBy(desc(userProfiles.createdAt)).limit(100),
    db.select().from(companies).orderBy(desc(companies.createdAt)).limit(500),
    db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(300),
    db.select().from(events).orderBy(desc(events.createdAt)).limit(200),
    db.select().from(jobSyncRuns).orderBy(desc(jobSyncRuns.startedAt)).limit(20),
    db.select().from(cities).orderBy(cities.id),
    db.select().from(jobSourceHealth).orderBy(desc(jobSourceHealth.updatedAt)).limit(50),
  ]);

  const stats = {
    totalUsers: dbUsers.length,
    pendingSubmissions: dbSubmissions.filter((s) => s.status === "PENDING").length,
    totalCompanies: dbCompanies.length,
    activeJobs: dbJobs.filter((j) => j.status === "ACTIVE").length,
    activeWalkins: dbJobs.filter((j) => j.status === "ACTIVE" && j.isWalkin).length,
    upcomingEvents: dbEvents.filter((e) => e.status === "UPCOMING").length,
    pendingClaims: dbClaims.filter((c) => c.status === "PENDING").length,
  };

  return (
    <AdminDashboardClient
      currentUser={user}
      currentProfile={profile}
      stats={stats}
      submissions={dbSubmissions}
      claims={dbClaims}
      users={dbUsers}
      companies={dbCompanies}
      jobs={dbJobs}
      events={dbEvents}
      syncRuns={dbSyncRuns}
      cities={dbCities}
      sourceHealth={dbSourceHealth}
    />
  );
}
