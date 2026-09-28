import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  cities,
  companies,
  companyTags,
  founders,
  jobs,
  events,
} from "../src/db/schema";
import {
  INDORE_SEED_COMPANIES,
  INDORE_SEED_FOUNDERS,
  INDORE_SEED_EVENTS,
  INDORE_SEED_JOBS,
} from "../src/db/indore-seed-data";
import { eq } from "drizzle-orm";

async function seedIndore() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL, {
    ssl: "require",
    max: 5,
    prepare: false,
  });
  const db = drizzle(client);

  console.log("🌱 Starting Indore dataset seeding...");

  // 1. Get or Create Indore City Record
  const [existingIndore] = await db
    .select()
    .from(cities)
    .where(eq(cities.slug, "indore"))
    .limit(1);

  let indoreId: number;
  if (existingIndore) {
    indoreId = existingIndore.id;
    await db
      .update(cities)
      .set({
        name: "Indore",
        state: "Madhya Pradesh",
        country: "India",
        description:
          "Indore is the largest and most populous city in Madhya Pradesh, consistently recognized as India's cleanest city. It is a premier commercial, educational, and emerging tech epicenter home to IIT Indore, IIM Indore, Super Corridor IT hubs, and a vibrant entrepreneurial ecosystem.",
        latitude: "22.7196",
        longitude: "75.8577",
        active: true,
        isPublished: true,
        updatedAt: new Date(),
      })
      .where(eq(cities.id, indoreId));
    console.log(`✅ Verified Indore city record (ID: ${indoreId})`);
  } else {
    const [newIndore] = await db
      .insert(cities)
      .values({
        name: "Indore",
        slug: "indore",
        state: "Madhya Pradesh",
        country: "India",
        description:
          "Indore is the largest and most populous city in Madhya Pradesh, consistently recognized as India's cleanest city. It is a premier commercial, educational, and emerging tech epicenter home to IIT Indore, IIM Indore, Super Corridor IT hubs, and a vibrant entrepreneurial ecosystem.",
        latitude: "22.7196",
        longitude: "75.8577",
        active: true,
        isPublished: true,
      })
      .returning();
    indoreId = newIndore.id;
    console.log(`✅ Created Indore city record (ID: ${indoreId})`);
  }

  // 2. Upsert Companies
  console.log(`Seeding ${INDORE_SEED_COMPANIES.length} verified Indore companies...`);
  const companySlugToId = new Map<string, number>();

  for (const c of INDORE_SEED_COMPANIES) {
    const [existing] = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.slug, c.slug))
      .limit(1);

    if (existing) {
      await db
        .update(companies)
        .set({
          name: c.name,
          logoUrl: c.logoUrl,
          websiteUrl: c.websiteUrl,
          linkedinUrl: c.linkedinUrl,
          descriptionShort: c.descriptionShort,
          descriptionLong: c.descriptionLong,
          sector: c.sector,
          companyType: c.companyType,
          stage: c.stage,
          foundedYear: c.foundedYear,
          teamSize: c.teamSize,
          locationName: c.locationName,
          latitude: c.latitude,
          longitude: c.longitude,
          address: c.address,
          cityId: indoreId,
          hiring: c.hiring,
          featured: c.featured ?? false,
          careersUrl: c.careersUrl,
          verificationStatus: c.verificationStatus,
          lastVerifiedAt: new Date(c.lastVerifiedAt),
          verificationSource: c.verificationSource,
          updatedAt: new Date(),
        })
        .where(eq(companies.id, existing.id));
      companySlugToId.set(c.slug, existing.id);
    } else {
      const [inserted] = await db
        .insert(companies)
        .values({
          name: c.name,
          slug: c.slug,
          logoUrl: c.logoUrl,
          websiteUrl: c.websiteUrl,
          linkedinUrl: c.linkedinUrl,
          descriptionShort: c.descriptionShort,
          descriptionLong: c.descriptionLong,
          sector: c.sector,
          companyType: c.companyType,
          stage: c.stage,
          foundedYear: c.foundedYear,
          teamSize: c.teamSize,
          locationName: c.locationName,
          latitude: c.latitude,
          longitude: c.longitude,
          address: c.address,
          cityId: indoreId,
          hiring: c.hiring,
          featured: c.featured ?? false,
          careersUrl: c.careersUrl,
          verificationStatus: c.verificationStatus,
          lastVerifiedAt: new Date(c.lastVerifiedAt),
          verificationSource: c.verificationSource,
        })
        .returning({ id: companies.id });
      companySlugToId.set(c.slug, inserted.id);
    }
  }
  console.log(`✅ ${companySlugToId.size} Indore companies upserted`);

  // 3. Upsert Company Tags
  const allTags: { companyId: number; tag: string }[] = [];
  for (const c of INDORE_SEED_COMPANIES) {
    const compId = companySlugToId.get(c.slug);
    if (compId && c.tags) {
      for (const tag of c.tags) {
        allTags.push({ companyId: compId, tag });
      }
    }
  }
  if (allTags.length > 0) {
    // Clear old tags for these companies to prevent duplicates
    for (const [_, compId] of companySlugToId) {
      await db.delete(companyTags).where(eq(companyTags.companyId, compId));
    }
    await db.insert(companyTags).values(allTags);
    console.log(`✅ ${allTags.length} Indore company tags seeded`);
  }

  // 4. Upsert Founders
  console.log(`Seeding ${INDORE_SEED_FOUNDERS.length} Indore founders...`);
  let founderCount = 0;
  for (const f of INDORE_SEED_FOUNDERS) {
    const compId = companySlugToId.get(f.companySlug);
    const [existing] = await db
      .select({ id: founders.id })
      .from(founders)
      .where(eq(founders.slug, f.slug))
      .limit(1);

    if (existing) {
      await db
        .update(founders)
        .set({
          name: f.name,
          companyId: compId ?? null,
          role: f.role,
          bio: f.bio,
          linkedinUrl: f.linkedinUrl,
          location: f.location,
          cityId: indoreId,
          updatedAt: new Date(),
        })
        .where(eq(founders.id, existing.id));
    } else {
      await db.insert(founders).values({
        name: f.name,
        slug: f.slug,
        companyId: compId ?? null,
        role: f.role,
        bio: f.bio,
        linkedinUrl: f.linkedinUrl,
        location: f.location,
        cityId: indoreId,
      });
    }
    founderCount++;
  }
  console.log(`✅ ${founderCount} Indore founders seeded`);

  // 5. Upsert Jobs
  console.log(`Seeding ${INDORE_SEED_JOBS.length} Indore jobs...`);
  let jobCount = 0;
  for (const j of INDORE_SEED_JOBS) {
    const compId = companySlugToId.get(j.companySlug);
    if (!compId) continue;

    const [existing] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.slug, j.slug))
      .limit(1);

    if (existing) {
      await db
        .update(jobs)
        .set({
          companyId: compId,
          title: j.title,
          description: j.description,
          location: j.location,
          remoteType: j.remoteType,
          employmentType: j.employmentType,
          experienceMin: j.experienceMin,
          experienceMax: j.experienceMax,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          currency: j.currency,
          skills: j.skills,
          applicationUrl: j.applicationUrl,
          sourceUrl: j.sourceUrl,
          department: j.department,
          postedAt: new Date(j.postedAt),
          status: "ACTIVE",
          featured: j.featured ?? false,
          cityId: indoreId,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, existing.id));
    } else {
      await db.insert(jobs).values({
        companyId: compId,
        title: j.title,
        slug: j.slug,
        description: j.description,
        location: j.location,
        remoteType: j.remoteType,
        employmentType: j.employmentType,
        experienceMin: j.experienceMin,
        experienceMax: j.experienceMax,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        currency: j.currency,
        skills: j.skills,
        applicationUrl: j.applicationUrl,
        sourceUrl: j.sourceUrl,
        department: j.department,
        postedAt: new Date(j.postedAt),
        status: "ACTIVE",
        featured: j.featured ?? false,
        cityId: indoreId,
      });
    }
    jobCount++;
  }
  console.log(`✅ ${jobCount} Indore verified jobs seeded`);

  // 6. Upsert Events
  console.log(`Seeding ${INDORE_SEED_EVENTS.length} Indore events...`);
  let eventCount = 0;
  for (const e of INDORE_SEED_EVENTS) {
    const [existing] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, e.slug))
      .limit(1);

    if (existing) {
      await db
        .update(events)
        .set({
          title: e.title,
          description: e.description,
          eventType: e.eventType,
          organizer: e.organizer,
          date: new Date(e.date),
          startTime: e.startTime,
          endTime: e.endTime,
          venue: e.venue,
          location: e.location,
          registrationUrl: e.registrationUrl,
          price: e.price,
          imageUrl: e.imageUrl,
          status: e.status,
          featured: e.featured ?? false,
          cityId: indoreId,
          updatedAt: new Date(),
        })
        .where(eq(events.id, existing.id));
    } else {
      await db.insert(events).values({
        title: e.title,
        slug: e.slug,
        description: e.description,
        eventType: e.eventType,
        organizer: e.organizer,
        date: new Date(e.date),
        startTime: e.startTime,
        endTime: e.endTime,
        venue: e.venue,
        location: e.location,
        registrationUrl: e.registrationUrl,
        price: e.price,
        imageUrl: e.imageUrl,
        status: e.status,
        featured: e.featured ?? false,
        cityId: indoreId,
      });
    }
    eventCount++;
  }
  console.log(`✅ ${eventCount} Indore verified events seeded`);

  console.log("🚀 Indore seeding completed successfully with 100% data isolation!");
  await client.end();
  process.exit(0);
}

seedIndore().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
