import { db } from "@/db";
import { companies, companyTags, founders, jobs } from "@/db/schema";
import { eq, and, ilike, desc, asc, sql, count, gte, lte, inArray } from "drizzle-orm";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import {
  COMPANIES_DATA,
  INDORE_COMPANIES_DATA,
  getCompaniesForCity,
  getAllCompanies,
  getFoundersForCity,
  getJobsForCity,
} from "@/lib/data";
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
    cityId,
    sort = "newest",
    page = 1,
  } = filters;

  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED"),
      ];

      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

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
    } catch {
      // Fall through to fallback
    }
  }

  // Static Fallback
  let list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.descriptionShort.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (sector) {
    list = list.filter((c) => c.sector.toLowerCase() === sector.toLowerCase());
  }
  if (area) {
    list = list.filter((c) => c.locationName.toLowerCase().includes(area.toLowerCase()));
  }
  if (hiring) {
    list = list.filter((c) => c.hiring);
  }
  if (stage) {
    list = list.filter((c) => c.stage === stage);
  }
  if (teamSize) {
    list = list.filter((c) => c.teamSize === teamSize);
  }

  const offset = (page - 1) * ITEMS_PER_PAGE;
  const paginated = list.slice(offset, offset + ITEMS_PER_PAGE);

  return {
    companies: paginated as any,
    total: list.length,
    page,
    totalPages: Math.ceil(list.length / ITEMS_PER_PAGE),
  };
}

/**
 * Get a single company by slug with founders and active jobs
 */
export async function getCompanyBySlug(slug: string, cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [eq(companies.slug, slug)];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      const [company] = await db
        .select()
        .from(companies)
        .where(and(...conditions))
        .limit(1);

      if (company) {
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
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback
  const all = getAllCompanies();
  const found = all.find((c) => c.slug === slug);
  if (!found) return null;

  const citySlug = cityId === 3 || found.locationName.includes("Indore") || found.locationName.includes("Pithampur") ? "indore" : "nagpur";
  const cityFounders = getFoundersForCity(citySlug).filter((f) => f.companySlug === slug);
  const cityJobs = getJobsForCity(citySlug).filter((j) => j.companySlug === slug);

  return {
    ...found,
    founders: cityFounders,
    jobs: cityJobs,
    tags: found.tags,
  };
}

/**
 * Get all verified company slugs for sitemap
 */
export async function getAllCompanySlugs(cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [eq(companies.verificationStatus, "VERIFIED")];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      return await db
        .select({
          slug: companies.slug,
          cityId: companies.cityId,
          updatedAt: companies.updatedAt,
        })
        .from(companies)
        .where(and(...conditions));
    } catch {
      // Fall through to fallback
    }
  }

  const list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  return list.map((c) => ({
    slug: c.slug,
    cityId: (c as any).cityId || (c.locationName.includes("Indore") ? 3 : 1),
    updatedAt: new Date(c.lastVerifiedAt || Date.now()),
  }));
}

/**
 * Get companies by sector for SEO pages
 */
export async function getCompaniesBySector(sectorSlug: string, page = 1, cityId?: number) {
  // Map slug to display name
  const sectorName = sectorSlug.replace(/-/g, " ");

  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED"),
        sql`LOWER(REPLACE(${companies.sector}, ' ', '-')) = ${sectorSlug.toLowerCase()} OR LOWER(${companies.sector}) = ${sectorName.toLowerCase()}`
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      const where = and(...conditions);
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
    } catch {
      // Fall through to fallback
    }
  }

  let list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  list = list.filter(
    (c) =>
      c.sector.toLowerCase().replace(/\s/g, "-") === sectorSlug.toLowerCase() ||
      c.sector.toLowerCase() === sectorName.toLowerCase()
  );

  const offset = (page - 1) * ITEMS_PER_PAGE;
  const paginated = list.slice(offset, offset + ITEMS_PER_PAGE);

  return {
    companies: paginated as any,
    total: list.length,
    hiringCount: list.filter((c) => c.hiring).length,
    page,
    totalPages: Math.ceil(list.length / ITEMS_PER_PAGE),
  };
}

/**
 * Get companies by area for SEO pages
 */
export async function getCompaniesByArea(areaSlug: string, page = 1, cityId?: number) {
  const areaName = areaSlug.replace(/-/g, " ");

  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED"),
        sql`LOWER(REPLACE(${companies.locationName}, ' ', '-')) = ${areaSlug.toLowerCase()} OR LOWER(${companies.locationName}) = ${areaName.toLowerCase()}`
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      const where = and(...conditions);
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
    } catch {
      // Fall through to fallback
    }
  }

  let list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  list = list.filter(
    (c) =>
      c.locationName.toLowerCase().replace(/\s/g, "-").includes(areaSlug.toLowerCase()) ||
      c.locationName.toLowerCase().includes(areaName.toLowerCase())
  );

  const offset = (page - 1) * ITEMS_PER_PAGE;
  const paginated = list.slice(offset, offset + ITEMS_PER_PAGE);

  return {
    companies: paginated as any,
    total: list.length,
    page,
    totalPages: Math.ceil(list.length / ITEMS_PER_PAGE),
  };
}

/**
 * Get hiring companies
 */
export async function getHiringCompanies(page = 1, cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED"),
        eq(companies.hiring, true)
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      const where = and(...conditions);
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
    } catch {
      // Fall through to fallback
    }
  }

  let list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  list = list.filter((c) => c.hiring);

  const offset = (page - 1) * ITEMS_PER_PAGE;
  const paginated = list.slice(offset, offset + ITEMS_PER_PAGE);

  return {
    companies: paginated as any,
    total: list.length,
    page,
    totalPages: Math.ceil(list.length / ITEMS_PER_PAGE),
  };
}

/**
 * Get featured companies
 */
export async function getFeaturedCompanies(limit = 6, cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED"),
        eq(companies.featured, true)
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      const res = await db
        .select()
        .from(companies)
        .where(and(...conditions))
        .orderBy(desc(companies.createdAt))
        .limit(limit);
      if (res.length > 0) return res;
    } catch {
      // Fall through to fallback
    }
  }

  const list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  return list.filter((c) => c.featured).slice(0, limit) as any;
}

/**
 * Get recently added companies
 */
export async function getRecentCompanies(limit = 6, cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED")
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      const res = await db
        .select()
        .from(companies)
        .where(and(...conditions))
        .orderBy(desc(companies.createdAt))
        .limit(limit);
      if (res.length > 0) return res;
    } catch {
      // Fall through to fallback
    }
  }

  const list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  return list.slice(0, limit) as any;
}

/**
 * Get all companies for alphabetical directory
 */
export async function getAllCompaniesAlphabetical(cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED")
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      return await db
        .select({
          id: companies.id,
          name: companies.name,
          slug: companies.slug,
          sector: companies.sector,
          locationName: companies.locationName,
          hiring: companies.hiring,
        })
        .from(companies)
        .where(and(...conditions))
        .orderBy(asc(companies.name));
    } catch {
      // Fall through to fallback
    }
  }

  const list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  return list
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sector: c.sector,
      locationName: c.locationName,
      hiring: c.hiring,
    }));
}

/**
 * Get map markers for all verified companies with coordinates
 */
export async function getMapMarkers(cityId?: number): Promise<MapMarker[]> {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED"),
        sql`${companies.latitude} IS NOT NULL AND ${companies.longitude} IS NOT NULL`
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

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
          cityId: companies.cityId,
        })
        .from(companies)
        .where(and(...conditions));

      if (data.length > 0) {
        return data.map((c) => ({
          ...c,
          latitude: parseFloat(c.latitude as string),
          longitude: parseFloat(c.longitude as string),
        }));
      }
    } catch {
      // Fall through to fallback
    }
  }

  const list = cityId === 3 ? INDORE_COMPANIES_DATA : cityId === 1 ? COMPANIES_DATA : getAllCompanies();
  return list
    .filter((c) => c.latitude && c.longitude)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      logoUrl: c.logoUrl ?? null,
      sector: c.sector,
      locationName: c.locationName,
      latitude: parseFloat(c.latitude),
      longitude: parseFloat(c.longitude),
      hiring: c.hiring,
      cityId: (c as any).cityId ?? (c.locationName.includes("Indore") ? 3 : 1),
    }));
}

/**
 * Get all verified companies with coordinates for interactive maps
 */
export async function getCityMapCompanies(cityId?: number, citySlug?: string): Promise<any[]> {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(companies.verificationStatus, "VERIFIED"),
        sql`${companies.latitude} IS NOT NULL AND ${companies.longitude} IS NOT NULL`,
      ];
      if (cityId) {
        conditions.push(eq(companies.cityId, cityId));
      }

      const data = await db
        .select()
        .from(companies)
        .where(and(...conditions))
        .orderBy(desc(companies.hiring), companies.name);

      if (data.length > 0) {
        return data.map((c) => ({
          ...c,
          latitude: String(c.latitude),
          longitude: String(c.longitude),
          tags: (c as any).tags || [],
        }));
      }
    } catch {
      // Fall through to fallback
    }
  }

  const list = getCompaniesForCity(citySlug || (cityId === 3 ? "indore" : cityId === 6 ? "bhopal" : "nagpur"));
  return list.filter((c) => c.latitude && c.longitude);
}

/**

 * Check for duplicate company (by name or website)
 */
export async function checkDuplicateCompany(name: string, websiteUrl?: string) {
  if (process.env.DATABASE_URL) {
    try {
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
    } catch {
      // Fall through to fallback
    }
  }

  const all = getAllCompanies();
  return all
    .filter((c) => c.name.toLowerCase().replace(/\s/g, "") === name.toLowerCase().replace(/\s/g, ""))
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}
