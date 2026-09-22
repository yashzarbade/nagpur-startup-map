import { db } from "@/db";
import { founders, companies } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

/**
 * Get all founders with company info
 */
export async function getFounders() {
  return db
    .select({
      id: founders.id,
      name: founders.name,
      slug: founders.slug,
      photoUrl: founders.photoUrl,
      role: founders.role,
      bio: founders.bio,
      linkedinUrl: founders.linkedinUrl,
      websiteUrl: founders.websiteUrl,
      xUrl: founders.xUrl,
      location: founders.location,
      companyName: companies.name,
      companySlug: companies.slug,
    })
    .from(founders)
    .leftJoin(companies, eq(founders.companyId, companies.id))
    .orderBy(asc(founders.name));
}

/**
 * Get founder by slug with company info
 */
export async function getFounderBySlug(slug: string) {
  const [founder] = await db
    .select({
      id: founders.id,
      name: founders.name,
      slug: founders.slug,
      photoUrl: founders.photoUrl,
      role: founders.role,
      bio: founders.bio,
      linkedinUrl: founders.linkedinUrl,
      websiteUrl: founders.websiteUrl,
      xUrl: founders.xUrl,
      location: founders.location,
      createdAt: founders.createdAt,
      companyId: founders.companyId,
      companyName: companies.name,
      companySlug: companies.slug,
      companySector: companies.sector,
      companyLogo: companies.logoUrl,
    })
    .from(founders)
    .leftJoin(companies, eq(founders.companyId, companies.id))
    .where(eq(founders.slug, slug))
    .limit(1);

  return founder ?? null;
}
