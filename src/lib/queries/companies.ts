import { db } from "@/db";
import { companies, companyTags, founders, jobs } from "@/db/schema";
import { eq, and, ilike, desc, asc, sql, count, gte, lte, inArray } from "drizzle-orm";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { StartupFilters, CompanyCard, MapMarker } from "@/types";

/**
 * Get companies with filters, search, sorting, and pagination
 */
export async function getCompanies(filters: StartupFilters = {}) {
  const {
    search,
    sector,
    area,
    hiring,
    stage,
    teamSize,
    sort = "newest",
    page = 1,
  } = filters;

  const conditions = [
    eq(companies.verificationStatus, "VERIFIED"),
  ];

  if (search) {
    conditions.push(
      sql`(${companies.name} ILIKE ${"%" + search + "%"} OR ${companies.descriptionShort} ILIKE ${"%" + search + "%"})`
    );
  }
  if (sector) {
    conditions.push(ilike(companies.sector, sector));
  }
  if (area) {
    conditions.push(ilike(companies.locationName, "%" + area + "%"));
  }
  if (hiring) {
    conditions.push(eq(companies.hiring, true));
  }
  if (stage) {
    conditions.push(eq(companies.stage, stage as any));
  }
  if (teamSize) {
    conditions.push(eq(companies.teamSize, teamSize));
  }

  const where = and(...conditions);

  const orderBy = (() => {
    switch (sort) {
      case "az": return asc(companies.name);
      case "za": return desc(companies.name);
      case "oldest": return asc(companies.createdAt);
      case "newest":
      default: return desc(companies.createdAt);
    }
  })();

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(companies)
      .where(where)
      .orderBy(orderBy)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db
      .select({ count: count() })
      .from(companies)
      .where(where),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    companies: data,
    total,
    page,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
  };
}

/**
 * Get a single company by slug with founders and active jobs
 */
export async function getCompanyBySlug(slug: string) {
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1);

  if (!company) return null;

  const [companyFounders, companyJobs, tags] = await Promise.all([
    db.select().from(founders).where(eq(founders.companyId, company.id)),
    db
      .select()
      .from(jobs)
      .where(and(eq(jobs.companyId, company.id), eq(jobs.status, "ACTIVE")))
      .orderBy(desc(jobs.postedAt)),
    db.select().from(companyTags).where(eq(companyTags.companyId, company.id)),
  ]);

  return {
    ...company,
    founders: companyFounders,
    jobs: companyJobs,
    tags: tags.map((t) => t.tag),
  };
}

/**
 * Get companies by sector for SEO pages
 */
export async function getCompaniesBySector(sectorSlug: string, page = 1) {
  // Map slug to display name
  const sectorName = sectorSlug.replace(/-/g, " ");

  const where = and(
    eq(companies.verificationStatus, "VERIFIED"),
    sql`LOWER(REPLACE(${companies.sector}, ' ', '-')) = ${sectorSlug.toLowerCase()} OR LOWER(${companies.sector}) = ${sectorName.toLowerCase()}`
  );

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [data, totalResult, hiringResult] = await Promise.all([
    db
      .select()
      .from(companies)
      .where(where)
      .orderBy(desc(companies.hiring), desc(companies.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db.select({ count: count() }).from(companies).where(where),
    db
      .select({ count: count() })
      .from(companies)
      .where(and(where, eq(companies.hiring, true))),
  ]);

  return {
    companies: data,
    total: totalResult[0]?.count ?? 0,
    hiringCount: hiringResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / ITEMS_PER_PAGE),
  };
}

/**
 * Get companies by area for SEO pages
 */
export async function getCompaniesByArea(areaSlug: string, page = 1) {
  const areaName = areaSlug.replace(/-/g, " ");

  const where = and(
    eq(companies.verificationStatus, "VERIFIED"),
    sql`LOWER(REPLACE(${companies.locationName}, ' ', '-')) = ${areaSlug.toLowerCase()} OR LOWER(${companies.locationName}) = ${areaName.toLowerCase()}`
  );

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(companies)
      .where(where)
      .orderBy(desc(companies.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db.select({ count: count() }).from(companies).where(where),
  ]);

  return {
    companies: data,
    total: totalResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / ITEMS_PER_PAGE),
  };
}

/**
 * Get hiring companies
 */
export async function getHiringCompanies(page = 1) {
  const where = and(
    eq(companies.verificationStatus, "VERIFIED"),
    eq(companies.hiring, true)
  );

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(companies)
      .where(where)
      .orderBy(desc(companies.featured), desc(companies.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db.select({ count: count() }).from(companies).where(where),
  ]);

  return {
    companies: data,
    total: totalResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / ITEMS_PER_PAGE),
  };
}

/**
 * Get featured companies
 */
export async function getFeaturedCompanies(limit = 6) {
  return db
    .select()
    .from(companies)
    .where(
      and(
        eq(companies.verificationStatus, "VERIFIED"),
        eq(companies.featured, true)
      )
    )
    .orderBy(desc(companies.createdAt))
    .limit(limit);
}

/**
 * Get recently added companies
 */
export async function getRecentCompanies(limit = 6) {
  return db
    .select()
    .from(companies)
    .where(eq(companies.verificationStatus, "VERIFIED"))
    .orderBy(desc(companies.createdAt))
    .limit(limit);
}

/**
 * Get all companies for alphabetical directory
 */
export async function getAllCompaniesAlphabetical() {
  return db
    .select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      sector: companies.sector,
      locationName: companies.locationName,
      hiring: companies.hiring,
    })
    .from(companies)
    .where(eq(companies.verificationStatus, "VERIFIED"))
    .orderBy(asc(companies.name));
}

/**
 * Get map markers for all verified companies with coordinates
 */
export async function getMapMarkers(): Promise<MapMarker[]> {
  const data = await db
    .select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      logoUrl: companies.logoUrl,
      sector: companies.sector,
      locationName: companies.locationName,
      latitude: companies.latitude,
      longitude: companies.longitude,
      hiring: companies.hiring,
    })
    .from(companies)
    .where(
      and(
        eq(companies.verificationStatus, "VERIFIED"),
        sql`${companies.latitude} IS NOT NULL AND ${companies.longitude} IS NOT NULL`
      )
    );

  return data.map((c) => ({
    ...c,
    latitude: parseFloat(c.latitude as string),
    longitude: parseFloat(c.longitude as string),
  }));
}

/**
 * Check for duplicate company (by name or website)
 */
export async function checkDuplicateCompany(name: string, websiteUrl?: string) {
  const conditions = [
    sql`LOWER(REPLACE(${companies.name}, ' ', '')) = ${name.toLowerCase().replace(/\s/g, "")}`,
  ];

  if (websiteUrl) {
    try {
      const domain = new URL(websiteUrl).hostname.replace("www.", "");
      conditions.push(
        sql`${companies.websiteUrl} ILIKE ${"%" + domain + "%"}`
      );
    } catch {}
  }

  const results = await db
    .select({ id: companies.id, name: companies.name, slug: companies.slug })
    .from(companies)
    .where(sql`(${sql.join(conditions, sql` OR `)})`)
    .limit(3);

  return results;
}
