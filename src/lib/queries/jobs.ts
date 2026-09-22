import { db } from "@/db";
import { jobs, companies } from "@/db/schema";
import { eq, and, desc, asc, sql, count, gte, lte, ilike } from "drizzle-orm";
import { JOBS_PER_PAGE } from "@/lib/constants";
import type { JobFilters, JobCard } from "@/types";

/**
 * Get jobs with filters, search, sorting, and pagination
 */
export async function getJobs(filters: JobFilters = {}) {
  const {
    search,
    employmentType,
    remoteType,
    department,
    freshness,
    sort = "newest",
    page = 1,
  } = filters;

  const conditions = [eq(jobs.status, "ACTIVE")];

  if (search) {
    conditions.push(
      sql`(${jobs.title} ILIKE ${"%" + search + "%"} OR ${jobs.skills} ILIKE ${"%" + search + "%"})`
    );
  }
  if (employmentType) {
    conditions.push(eq(jobs.employmentType, employmentType as any));
  }
  if (remoteType) {
    conditions.push(eq(jobs.remoteType, remoteType as any));
  }
  if (department) {
    conditions.push(ilike(jobs.department, department));
  }
  if (freshness) {
    const now = new Date();
    const cutoff = new Date();
    if (freshness === "today") cutoff.setDate(now.getDate() - 1);
    else if (freshness === "week") cutoff.setDate(now.getDate() - 7);
    else if (freshness === "month") cutoff.setDate(now.getDate() - 30);
    conditions.push(gte(jobs.postedAt, cutoff));
  }

  const where = and(...conditions);

  const orderBy = (() => {
    switch (sort) {
      case "salary-high":
        return desc(jobs.salaryMax);
      case "salary-low":
        return asc(jobs.salaryMin);
      case "newest":
      default:
        return desc(jobs.postedAt);
    }
  })();

  const offset = (page - 1) * JOBS_PER_PAGE;

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: jobs.id,
        title: jobs.title,
        slug: jobs.slug,
        location: jobs.location,
        remoteType: jobs.remoteType,
        employmentType: jobs.employmentType,
        experienceMin: jobs.experienceMin,
        experienceMax: jobs.experienceMax,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        currency: jobs.currency,
        skills: jobs.skills,
        postedAt: jobs.postedAt,
        featured: jobs.featured,
        department: jobs.department,
        companyName: companies.name,
        companySlug: companies.slug,
        companyLogo: companies.logoUrl,
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(where)
      .orderBy(desc(jobs.featured), orderBy)
      .limit(JOBS_PER_PAGE)
      .offset(offset),
    db.select({ count: count() }).from(jobs).where(where),
  ]);

  return {
    jobs: data,
    total: totalResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / JOBS_PER_PAGE),
  };
}

/**
 * Get a single job by slug with company info
 */
export async function getJobBySlug(slug: string) {
  const [job] = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      description: jobs.description,
      location: jobs.location,
      remoteType: jobs.remoteType,
      employmentType: jobs.employmentType,
      experienceMin: jobs.experienceMin,
      experienceMax: jobs.experienceMax,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      currency: jobs.currency,
      skills: jobs.skills,
      applicationUrl: jobs.applicationUrl,
      sourceUrl: jobs.sourceUrl,
      department: jobs.department,
      postedAt: jobs.postedAt,
      expiresAt: jobs.expiresAt,
      status: jobs.status,
      featured: jobs.featured,
      companyId: companies.id,
      companyName: companies.name,
      companySlug: companies.slug,
      companyLogo: companies.logoUrl,
      companySector: companies.sector,
      companyLocation: companies.locationName,
    })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.slug, slug))
    .limit(1);

  return job ?? null;
}

/**
 * Get related jobs (same company or similar title/skills)
 */
export async function getRelatedJobs(jobId: number, companyId: number, limit = 5) {
  return db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      location: jobs.location,
      employmentType: jobs.employmentType,
      postedAt: jobs.postedAt,
      companyName: companies.name,
      companySlug: companies.slug,
      companyLogo: companies.logoUrl,
    })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(
      and(
        eq(jobs.status, "ACTIVE"),
        sql`${jobs.id} != ${jobId}`
      )
    )
    .orderBy(
      sql`CASE WHEN ${jobs.companyId} = ${companyId} THEN 0 ELSE 1 END`,
      desc(jobs.postedAt)
    )
    .limit(limit);
}

/**
 * Get latest jobs for homepage
 */
export async function getLatestJobs(limit = 6) {
  return db
    .select({
      id: jobs.id,
      title: jobs.title,
      slug: jobs.slug,
      location: jobs.location,
      remoteType: jobs.remoteType,
      employmentType: jobs.employmentType,
      experienceMin: jobs.experienceMin,
      experienceMax: jobs.experienceMax,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      currency: jobs.currency,
      skills: jobs.skills,
      postedAt: jobs.postedAt,
      featured: jobs.featured,
      companyName: companies.name,
      companySlug: companies.slug,
      companyLogo: companies.logoUrl,
    })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.status, "ACTIVE"))
    .orderBy(desc(jobs.featured), desc(jobs.postedAt))
    .limit(limit);
}

/**
 * Get jobs by company
 */
export async function getJobsByCompany(companyId: number) {
  return db
    .select()
    .from(jobs)
    .where(and(eq(jobs.companyId, companyId), eq(jobs.status, "ACTIVE")))
    .orderBy(desc(jobs.postedAt));
}

/**
 * Count active jobs
 */
export async function countActiveJobs() {
  const [result] = await db
    .select({ count: count() })
    .from(jobs)
    .where(eq(jobs.status, "ACTIVE"));
  return result?.count ?? 0;
}
