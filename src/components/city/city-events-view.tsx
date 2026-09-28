import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EVENT_TYPES } from "@/lib/constants";
import { getEvents } from "@/lib/queries/events";
import type { City } from "@/types";

interface CityEventsViewProps {
  city: City;
}

export async function CityEventsView({ city }: CityEventsViewProps) {
  const cityId = city.id;
  const cityName = city.name;
  const citySlug = city.slug;

  const { events: eventsList, total } = await getEvents(1, undefined, cityId);

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: cityName, href: `/${citySlug}` },
          { label: "Events", href: `/${citySlug}/events` },
        ]}
      />

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Startup & Tech Events in {cityName}
          </h1>
          <p className="text-muted-foreground mt-2">
            {total > 0
              ? `Discover ${total} upcoming meetups, hackathons, and demo days across ${cityName}`
              : `Meetups, hackathons, workshops, and startup conferences across ${cityName}`}
          </p>
        </div>
        <Link
          href="/submit/event"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add an Event</span>
        </Link>
      </div>

      {/* Events grid or empty state */}
      {eventsList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventsList.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No upcoming events in ${cityName} right now`}
          description={`Be the first to host or share an upcoming tech meetup, hackathon, or pitch night in ${cityName}!`}
          actionLabel="Add an Event"
          actionHref="/submit/event"
          secondaryLabel={`Explore ${cityName} Startups`}
          secondaryHref={`/${citySlug}/startups`}
        />
      )}
    </div>
  );
}
