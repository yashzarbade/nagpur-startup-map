import { db } from "@/db";
import { jobs, companies } from "@/db/schema";
import { eq, and, desc, asc, sql, count, gte, ilike } from "drizzle-orm";
import { JOBS_PER_PAGE } from "@/lib/constants";
import { JOBS_DATA, COMPANIES_DATA, getJobsForCity, getAllJobs } from "@/lib/data";
import type { JobFilters } from "@/types";

/**
 * Get jobs with filters, search, sorting, and pagination.
 * Queries PostgreSQL database; gracefully falls back to JOBS_DATA if DB is offline/unconfigured.
 */
export async function getJobs(filters: JobFilters = {}) {
  const {
    search,
    employmentType,
    remoteType,
    department,
    freshness,
    cityId,
    sort = "newest",
    page = 1,
  } = filters;

  if (process.env.DATABASE_URL) {
    try {
      const conditions = [eq(jobs.status, "ACTIVE")];

      if (cityId) {
        conditions.push(eq(jobs.cityId, cityId));
      }

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

      const totalCount = totalResult[0]?.count ?? 0;
      return {
        jobs: data,
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / JOBS_PER_PAGE),
      };
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback to static data (only for Nagpur / cityId 1 or unspecified)
  if (cityId && cityId !== 1) {
    return {
      jobs: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }

  let filtered = [...JOBS_DATA];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        (j.skills && j.skills.toLowerCase().includes(q))
    );
  }
  if (employmentType) {
    filtered = filtered.filter((j) => j.employmentType === employmentType);
  }
  if (remoteType) {
    filtered = filtered.filter((j) => j.remoteType === remoteType);
  }
  if (department) {
    filtered = filtered.filter(
      (j) => j.department?.toLowerCase() === department.toLowerCase()
    );
  }
  if (freshness) {
    const cutoff = new Date();
    if (freshness === "today") cutoff.setDate(cutoff.getDate() - 1);
    else if (freshness === "week") cutoff.setDate(cutoff.getDate() - 7);
    else if (freshness === "month") cutoff.setDate(cutoff.getDate() - 30);
    filtered = filtered.filter((j) => new Date(j.postedAt) >= cutoff);
  }

  if (sort === "salary-high") {
    filtered.sort((a, b) => (b.salaryMax ?? 0) - (a.salaryMax ?? 0));
  } else if (sort === "salary-low") {
    filtered.sort((a, b) => (a.salaryMin ?? 0) - (b.salaryMin ?? 0));
  } else {
    filtered.sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
  }

  const offset = (page - 1) * JOBS_PER_PAGE;
  const paginated = filtered.slice(offset, offset + JOBS_PER_PAGE);

  return {
    jobs: paginated.map((j) => ({
      ...j,
      postedAt: new Date(j.postedAt),
    })),
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / JOBS_PER_PAGE),
  };
}

/**
 * Get a single job by slug with company info
 */
export async function getJobBySlug(slug: string) {
  if (process.env.DATABASE_URL) {
    try {
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

      if (job) return job;
    } catch {
      // Fall through to fallback
    }
  }

  const found = JOBS_DATA.find((j) => j.slug === slug);
  if (!found) return null;
  const comp = COMPANIES_DATA.find((c) => c.slug === found.companySlug);

  return {
    ...found,
    sourceUrl: found.applicationUrl,
    postedAt: new Date(found.postedAt),
    expiresAt: found.expiresAt ? new Date(found.expiresAt) : null,
    status: "ACTIVE" as const,
    companyId: comp?.id ?? 0,
    companySector: comp?.sector ?? "Technology",
    companyLocation: comp?.locationName ?? "Nagpur",
  };
}

/**
 * Get related jobs (same company or similar title/skills)
 */
export async function getRelatedJobs(
  jobId: number,
  companyId: number,
  limit = 5,
  cityId?: number
) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(jobs.status, "ACTIVE"),
        sql`${jobs.id} != ${jobId}`
      ];
      if (cityId) {
        conditions.push(eq(jobs.cityId, cityId));
      }

      const related = await db
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
        .where(and(...conditions))
        .orderBy(
          sql`CASE WHEN ${jobs.companyId} = ${companyId} THEN 0 ELSE 1 END`,
          desc(jobs.postedAt)
        )
        .limit(limit);

      if (related.length > 0) return related;
    } catch {
      // Fall through to fallback
    }
  }

  return JOBS_DATA.filter((j) => j.id !== jobId)
    .slice(0, limit)
    .map((j) => ({
      id: j.id,
      title: j.title,
      slug: j.slug,
      location: j.location,
      employmentType: j.employmentType,
      postedAt: new Date(j.postedAt),
      companyName: j.companyName,
      companySlug: j.companySlug,
      companyLogo: j.companyLogo ?? null,
    }));
}

/**
 * Get latest jobs for homepage / city page
 */
export async function getLatestJobs(limit = 6, cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [eq(jobs.status, "ACTIVE")];
      if (cityId) {
        conditions.push(eq(jobs.cityId, cityId));
      }

      const list = await db
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
        .where(and(...conditions))
        .orderBy(desc(jobs.featured), desc(jobs.postedAt))
        .limit(limit);

      if (list.length > 0) return list;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback (Nagpur only)
  if (cityId && cityId !== 1) {
    return [];
  }

  return JOBS_DATA.slice(0, limit).map((j) => ({
    id: j.id,
    title: j.title,
    slug: j.slug,
    location: j.location,
    remoteType: j.remoteType,
    employmentType: j.employmentType,
    experienceMin: j.experienceMin,
    experienceMax: j.experienceMax,
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    currency: j.currency,
    skills: j.skills,
    postedAt: new Date(j.postedAt),
    featured: j.featured,
    companyName: j.companyName,
    companySlug: j.companySlug,
    companyLogo: j.companyLogo ?? null,
  }));
}

/**
 * Get jobs by company
 */
export async function getJobsByCompany(companyId: number) {
  if (process.env.DATABASE_URL) {
    try {
      return await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.companyId, companyId), eq(jobs.status, "ACTIVE")))
        .orderBy(desc(jobs.postedAt));
    } catch {
      // Fall through to fallback
    }
  }

  return [];
}

/**
 * Count active jobs
 */
export async function countActiveJobs(cityId?: number): Promise<number> {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [eq(jobs.status, "ACTIVE")];
      if (cityId) {
        conditions.push(eq(jobs.cityId, cityId));
      }

      const [result] = await db
        .select({ count: count() })
        .from(jobs)
        .where(and(...conditions));
      if (result?.count !== undefined) return result.count;
    } catch {
      // Fall through to fallback
    }
  }

  if (cityId && cityId !== 1) {
    return 0;
  }

  return JOBS_DATA.length;
}

/**
 * Get all active job slugs (for sitemap)
 */
export async function getActiveJobSlugs(cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [eq(jobs.status, "ACTIVE")];
      if (cityId) {
        conditions.push(eq(jobs.cityId, cityId));
      }

      const slugs = await db
        .select({
          slug: jobs.slug,
          cityId: jobs.cityId,
          postedAt: jobs.postedAt,
        })
        .from(jobs)
        .where(and(...conditions));

      if (slugs.length > 0) return slugs;
    } catch {
      // Fall through to fallback
    }
  }

  const list = cityId === 3 ? getJobsForCity("indore") : cityId === 1 ? getJobsForCity("nagpur") : getAllJobs();
  return list.map((j: any) => ({
    slug: j.slug,
    cityId: (j as any).cityId || (j.location?.toLowerCase().includes("indore") ? 3 : 1),
    postedAt: new Date(j.postedAt),
  }));
}

/**
 * Get a job by slug regardless of status (for expired job pages).
 * Returns the job even if expired, so we can show "no longer active" message.
 */
export async function getJobBySlugWithStatus(slug: string) {
  if (process.env.DATABASE_URL) {
    try {
      const [job] = await db
        .select({
          id: jobs.id,
          cityId: jobs.cityId,
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
          sourceType: jobs.sourceType,
          department: jobs.department,
          postedAt: jobs.postedAt,
          expiresAt: jobs.expiresAt,
          status: jobs.status,
          featured: jobs.featured,
          lastSeenAt: jobs.lastSeenAt,
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

      if (job) return job;
    } catch {
      // Fall through to fallback
    }
  }

  const allFallbackJobs = getAllJobs();
  const found = allFallbackJobs.find((j: any) => j.slug === slug);
  if (!found) return null;
  const comp = COMPANIES_DATA.find((c) => c.slug === found.companySlug);

  return {
    ...found,
    cityId: (found as any).cityId || (found.location?.toLowerCase().includes("indore") ? 3 : 1),
    sourceUrl: found.applicationUrl,
    sourceType: "CAREERS_PAGE" as const,
    status: "ACTIVE" as const,
    lastSeenAt: new Date(found.postedAt),
    postedAt: new Date(found.postedAt),
    expiresAt: found.expiresAt ? new Date(found.expiresAt) : null,
    companyId: comp?.id ?? 0,
    companySector: comp?.sector ?? "Technology",
    companyLocation: comp?.locationName ?? "Nagpur",
  };
}

/**
 * Get active jobs by company (for expired job page sidebar)
 */
export async function getActiveJobsByCompany(companyId: number) {
  if (process.env.DATABASE_URL) {
    try {
      const active = await db
        .select({
          id: jobs.id,
          title: jobs.title,
          slug: jobs.slug,
          location: jobs.location,
          remoteType: jobs.remoteType,
          employmentType: jobs.employmentType,
          postedAt: jobs.postedAt,
          companyName: companies.name,
          companySlug: companies.slug,
          companyLogo: companies.logoUrl,
        })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(and(eq(jobs.companyId, companyId), eq(jobs.status, "ACTIVE")))
        .orderBy(desc(jobs.postedAt))
        .limit(5);

      if (active.length > 0) return active;
    } catch {
      // Fall through to fallback
    }
  }

  return JOBS_DATA.slice(0, 3).map((j) => ({
    id: j.id,
    title: j.title,
    slug: j.slug,
    location: j.location,
    remoteType: j.remoteType,
    employmentType: j.employmentType,
    postedAt: new Date(j.postedAt),
    companyName: j.companyName,
    companySlug: j.companySlug,
    companyLogo: j.companyLogo ?? null,
  }));
}
