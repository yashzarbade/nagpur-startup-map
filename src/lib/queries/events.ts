import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, and, desc, asc, gte, count } from "drizzle-orm";
import { EVENTS_PER_PAGE } from "@/lib/constants";

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(limit?: number) {
  const query = db
    .select()
    .from(events)
    .where(
      and(eq(events.status, "UPCOMING"), gte(events.date, new Date()))
    )
    .orderBy(asc(events.date));

  if (limit) {
    return query.limit(limit);
  }
  return query;
}

/**
 * Get event by slug
 */
export async function getEventBySlug(slug: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);
  return event ?? null;
}

/**
 * Get paginated events
 */
export async function getEvents(page = 1, eventType?: string) {
  const conditions = [gte(events.date, new Date())];
  if (eventType) {
    conditions.push(eq(events.eventType, eventType as any));
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
