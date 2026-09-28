import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, and, desc, asc, gte, count } from "drizzle-orm";
import { EVENTS_PER_PAGE } from "@/lib/constants";

import { getEventsForCity, getEventBySlug as getStaticEventBySlug } from "@/lib/data";

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(limit?: number, cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [
        eq(events.status, "UPCOMING"),
        gte(events.date, new Date()),
      ];
      if (cityId) {
        conditions.push(eq(events.cityId, cityId));
      }

      const query = db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(asc(events.date));

      if (limit) {
        const res = await query.limit(limit);
        if (res.length > 0) return res;
      } else {
        const res = await query;
        if (res.length > 0) return res;
      }
    } catch {
      // Fall through to static data
    }
  }

  const citySlug = cityId === 3 ? "indore" : "nagpur";
  const staticEvents = getEventsForCity(citySlug)
    .filter((e) => e.status === "UPCOMING" && new Date(e.date) >= new Date())
    .map((e) => ({
      ...e,
      cityId: cityId || (citySlug === "indore" ? 3 : 1),
      date: new Date(e.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  return limit ? staticEvents.slice(0, limit) : staticEvents;
}

export async function getEventBySlug(slug: string, cityId?: number) {
  if (process.env.DATABASE_URL) {
    try {
      const conditions = [eq(events.slug, slug)];
      if (cityId) {
        conditions.push(eq(events.cityId, cityId));
      }

      const [event] = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .limit(1);
      if (event) return event;
    } catch {
      // Fall through
    }
  }

  const citySlug = cityId === 3 ? "indore" : "nagpur";
  const ev = getEventsForCity(citySlug).find((e) => e.slug === slug);
  if (!ev) return null;

  return {
    ...ev,
    cityId: cityId || (citySlug === "indore" ? 3 : 1),
    date: new Date(ev.date),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;
}

/**
 * Get all upcoming event slugs for sitemap
 */
export async function getAllEventSlugs(cityId?: number) {
  const conditions = [
    eq(events.status, "UPCOMING"),
    gte(events.date, new Date()),
  ];
  if (cityId) {
    conditions.push(eq(events.cityId, cityId));
  }

  return db
    .select({
      slug: events.slug,
      cityId: events.cityId,
      updatedAt: events.updatedAt,
    })
    .from(events)
    .where(and(...conditions));
}

/**
 * Get paginated events
 */
export async function getEvents(page = 1, eventType?: string, cityId?: number) {
  const conditions = [gte(events.date, new Date())];
  if (eventType) {
    conditions.push(eq(events.eventType, eventType as any));
  }
  if (cityId) {
    conditions.push(eq(events.cityId, cityId));
  }

  const where = and(...conditions);
  const offset = (page - 1) * EVENTS_PER_PAGE;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(events)
      .where(where)
      .orderBy(asc(events.date))
      .limit(EVENTS_PER_PAGE)
      .offset(offset),
    db.select({ count: count() }).from(events).where(where),
  ]);

  return {
    events: data,
    total: totalResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((totalResult[0]?.count ?? 0) / EVENTS_PER_PAGE),
  };
}
