import { db } from "@/db";
import { companies, jobs, founders, events } from "@/db/schema";
import { eq, and, count, gte, sql } from "drizzle-orm";
import type { EcosystemStats } from "@/types";

/**
 * Get all ecosystem statistics for the homepage or city page
 */
export async function getEcosystemStats(cityId?: number): Promise<EcosystemStats> {
  const companyConditions = [eq(companies.verificationStatus, "VERIFIED")];
  const jobConditions = [eq(jobs.status, "ACTIVE")];
  const founderConditions: any[] = [];
  const eventConditions = [
    eq(events.status, "UPCOMING"),
    gte(events.date, new Date()),
  ];
  const hiringConditions = [
    eq(companies.verificationStatus, "VERIFIED"),
    eq(companies.hiring, true),
  ];

  if (cityId) {
    companyConditions.push(eq(companies.cityId, cityId));
    jobConditions.push(eq(jobs.cityId, cityId));
    founderConditions.push(eq(founders.cityId, cityId));
    eventConditions.push(eq(events.cityId, cityId));
    hiringConditions.push(eq(companies.cityId, cityId));
  }

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
      .where(and(...companyConditions)),
    db
      .select({ count: count() })
      .from(jobs)
      .where(and(...jobConditions)),
    founderConditions.length > 0
      ? db
          .select({ count: count() })
          .from(founders)
          .where(and(...founderConditions))
      : db.select({ count: count() }).from(founders),
    db
      .select({ count: count() })
      .from(events)
      .where(and(...eventConditions)),
    db
      .select({ count: count() })
      .from(companies)
      .where(and(...hiringConditions)),
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
export async function getSectorCounts(cityId?: number) {
  const conditions = [eq(companies.verificationStatus, "VERIFIED")];
  if (cityId) {
    conditions.push(eq(companies.cityId, cityId));
  }

  return db
    .select({
      sector: companies.sector,
      count: count(),
    })
    .from(companies)
    .where(and(...conditions))
    .groupBy(companies.sector)
    .orderBy(sql`count(*) DESC`);
}

/**
 * Get area-wise company count
 */
export async function getAreaCounts(cityId?: number) {
  const conditions = [
    eq(companies.verificationStatus, "VERIFIED"),
    sql`${companies.locationName} IS NOT NULL`,
  ];
  if (cityId) {
    conditions.push(eq(companies.cityId, cityId));
  }

  return db
    .select({
      area: companies.locationName,
      count: count(),
    })
    .from(companies)
    .where(and(...conditions))
    .groupBy(companies.locationName)
    .orderBy(sql`count(*) DESC`);
}
