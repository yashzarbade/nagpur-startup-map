import { db } from "@/db";
import { companies, jobs, founders, events } from "@/db/schema";
import { eq, and, count, gte, sql } from "drizzle-orm";
import type { EcosystemStats } from "@/types";

/**
 * Get all ecosystem statistics for the homepage
 */
export async function getEcosystemStats(): Promise<EcosystemStats> {
  const [
    companiesResult,
    jobsResult,
    foundersResult,
    eventsResult,
    hiringResult,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(companies)
      .where(eq(companies.verificationStatus, "VERIFIED")),
    db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.status, "ACTIVE")),
    db.select({ count: count() }).from(founders),
    db
      .select({ count: count() })
      .from(events)
      .where(
        and(
          eq(events.status, "UPCOMING"),
          gte(events.date, new Date())
        )
      ),
    db
      .select({ count: count() })
      .from(companies)
      .where(
        and(
          eq(companies.verificationStatus, "VERIFIED"),
          eq(companies.hiring, true)
        )
      ),
  ]);

  return {
    totalCompanies: companiesResult[0]?.count ?? 0,
    totalJobs: jobsResult[0]?.count ?? 0,
    totalFounders: foundersResult[0]?.count ?? 0,
    totalEvents: eventsResult[0]?.count ?? 0,
    hiringCompanies: hiringResult[0]?.count ?? 0,
  };
}

/**
 * Get sector-wise company count
 */
export async function getSectorCounts() {
  return db
    .select({
      sector: companies.sector,
      count: count(),
    })
    .from(companies)
    .where(eq(companies.verificationStatus, "VERIFIED"))
    .groupBy(companies.sector)
    .orderBy(sql`count(*) DESC`);
}

/**
 * Get area-wise company count
 */
export async function getAreaCounts() {
  return db
    .select({
      area: companies.locationName,
      count: count(),
    })
    .from(companies)
    .where(
      and(
        eq(companies.verificationStatus, "VERIFIED"),
        sql`${companies.locationName} IS NOT NULL`
      )
    )
    .groupBy(companies.locationName)
    .orderBy(sql`count(*) DESC`);
}
