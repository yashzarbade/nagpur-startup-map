import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE, EVENT_TYPES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tech Events in Nagpur",
  description:
    "Discover tech meetups, hackathons, workshops, conferences and startup events in Nagpur. Stay connected with Nagpur's technology community.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Tech Events in Nagpur | Nagpur Startup Map",
    description: "Discover tech meetups, hackathons, and startup events in Nagpur.",
    url: `${SITE.url}/events`,
  },
};

import { getAllEvents } from "@/lib/data";

export default function EventsPage() {
  const events = getAllEvents();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Events", href: "/events" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tech Events in Nagpur</h1>
        <p className="text-muted-foreground mt-2">
          {events.length} upcoming events in Nagpur&apos;s tech ecosystem
        </p>
      </div>

      {/* Event type filters */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
          Categories:
        </span>
        {EVENT_TYPES.filter(t => t.value !== "OTHER").map((type) => (
          <span
            key={type.value}
            className="badge-sector cursor-pointer"
          >
            {type.label}
          </span>
        ))}
      </div>

      {/* Events list */}
      {events.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No upcoming events"
          description="No events scheduled right now. Know of an upcoming tech event?"
          actionLabel="Add an event"
          actionHref="/submit/event"
        />
      )}
    </div>
  );
}
