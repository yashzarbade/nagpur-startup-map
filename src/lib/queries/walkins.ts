import { db } from "@/db";
import { jobs, companies, cities } from "@/db/schema";
import { eq, and, desc, asc, sql, count, gte, lte, ilike } from "drizzle-orm";
import type { WalkinCard, WalkinFilters } from "@/types";

const WALKINS_PER_PAGE = 15;

/**
 * Fetch walk-in drives with filtering, pagination, and sorting.
 */
export async function getWalkins(filters: WalkinFilters = {}) {
  const {
    search,
    citySlug,
    cityId,
    freshness = "upcoming",
    sort = "upcoming",
    page = 1,
  } = filters;

  try {
    const conditions = [
      eq(jobs.isWalkin, true),
      eq(jobs.status, "ACTIVE"),
      eq(jobs.moderationStatus, "APPROVED"),
    ];

    if (cityId) {
      conditions.push(eq(jobs.cityId, cityId));
    } else if (citySlug) {
      const [matchedCity] = await db
        .select({ id: cities.id })
        .from(cities)
        .where(eq(cities.slug, citySlug.toLowerCase()))
        .limit(1);
      if (matchedCity) {
        conditions.push(eq(jobs.cityId, matchedCity.id));
      }
    }

    if (search) {
      conditions.push(
        sql`(${jobs.title} ILIKE ${"%" + search + "%"} OR ${jobs.skills} ILIKE ${"%" + search + "%"} OR ${jobs.walkinVenue} ILIKE ${"%" + search + "%"})`
      );
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (freshness === "upcoming") {
      conditions.push(gte(jobs.walkinDate, startOfToday));
    } else if (freshness === "today") {
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      conditions.push(gte(jobs.walkinDate, startOfToday));
      conditions.push(lte(jobs.walkinDate, endOfToday));
    }

    const where = and(...conditions);

    const orderBy =
      sort === "upcoming"
        ? [asc(jobs.walkinDate), desc(jobs.featured)]
        : [desc(jobs.postedAt)];

    const offset = (page - 1) * WALKINS_PER_PAGE;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          id: jobs.id,
          title: jobs.title,
          slug: jobs.slug,
          location: jobs.location,
          cityId: jobs.cityId,
          cityName: cities.name,
          citySlug: cities.slug,
          walkinDate: jobs.walkinDate,
          walkinStartTime: jobs.walkinStartTime,
          walkinEndTime: jobs.walkinEndTime,
          walkinVenue: jobs.walkinVenue,
          experienceMin: jobs.experienceMin,
          experienceMax: jobs.experienceMax,
          salaryMin: jobs.salaryMin,
          salaryMax: jobs.salaryMax,
          skills: jobs.skills,
          applicationUrl: jobs.applicationUrl,
          sourceUrl: jobs.sourceUrl,
          sourceType: jobs.sourceType,
          verificationStatus: jobs.verificationStatus,
          status: jobs.status,
          featured: jobs.featured,
          companyName: companies.name,
          companySlug: companies.slug,
          companyLogo: companies.logoUrl,
        })
        .from(jobs)
        .leftJoin(companies, eq(jobs.companyId, companies.id))
        .leftJoin(cities, eq(jobs.cityId, cities.id))
        .where(where)
        .orderBy(...orderBy)
        .limit(WALKINS_PER_PAGE)
        .offset(offset),
      db.select({ count: count() }).from(jobs).where(where),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    const formattedWalkins: WalkinCard[] = data.map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      companyName: d.companyName || "Direct Recruiter",
      companySlug: d.companySlug || "recruiter",
      companyLogo: d.companyLogo,
      location: d.location,
      cityId: d.cityId,
      cityName: d.cityName || "Central India",
      citySlug: d.citySlug || "central-india",
      walkinDate: d.walkinDate || new Date(),
      walkinStartTime: d.walkinStartTime,
      walkinEndTime: d.walkinEndTime,
      walkinVenue: d.walkinVenue,
      experienceMin: d.experienceMin,
      experienceMax: d.experienceMax,
      salaryMin: d.salaryMin,
      salaryMax: d.salaryMax,
      skills: d.skills,
      applicationUrl: d.applicationUrl,
      sourceUrl: d.sourceUrl,
      sourceType: d.sourceType,
      verificationStatus: d.verificationStatus,
      status: d.status,
      featured: d.featured,
    }));

    return {
      walkins: formattedWalkins,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / WALKINS_PER_PAGE),
    };
  } catch (error) {
    console.error("[walkins] Error fetching walkins:", error);
    return {
      walkins: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }
}

/**
 * Fetch a single walkin by slug
 */
export async function getWalkinBySlug(slug: string) {
  try {
    const [row] = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        slug: jobs.slug,
        description: jobs.description,
        location: jobs.location,
        remoteType: jobs.remoteType,
        employmentType: jobs.employmentType,
        cityId: jobs.cityId,
        cityName: cities.name,
        citySlug: cities.slug,
        walkinDate: jobs.walkinDate,
        walkinStartTime: jobs.walkinStartTime,
        walkinEndTime: jobs.walkinEndTime,
        walkinVenue: jobs.walkinVenue,
        experienceMin: jobs.experienceMin,
        experienceMax: jobs.experienceMax,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        currency: jobs.currency,
        skills: jobs.skills,
        applicationUrl: jobs.applicationUrl,
        sourceUrl: jobs.sourceUrl,
        sourceType: jobs.sourceType,
        sourceChannel: jobs.sourceChannel,
        verificationStatus: jobs.verificationStatus,
        status: jobs.status,
        contactDetails: jobs.contactDetails,
        postedAt: jobs.postedAt,
        featured: jobs.featured,
        companyId: companies.id,
        companyName: companies.name,
        companySlug: companies.slug,
        companyLogo: companies.logoUrl,
        companyWebsite: companies.websiteUrl,
        companyDescription: companies.descriptionShort,
      })
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .leftJoin(cities, eq(jobs.cityId, cities.id))
      .where(eq(jobs.slug, slug))
      .limit(1);

    return row || null;
  } catch (error) {
    console.error(`[walkins] Error fetching walkin by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Count active upcoming walk-ins
 */
export async function countActiveWalkins(cityId?: number) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const conditions = [
      eq(jobs.isWalkin, true),
      eq(jobs.status, "ACTIVE"),
      eq(jobs.moderationStatus, "APPROVED"),
      gte(jobs.walkinDate, startOfToday),
    ];

    if (cityId) {
      conditions.push(eq(jobs.cityId, cityId));
    }

    const [res] = await db
      .select({ count: count() })
      .from(jobs)
      .where(and(...conditions));

    return res?.count ?? 0;
  } catch {
    return 0;
  }
}
