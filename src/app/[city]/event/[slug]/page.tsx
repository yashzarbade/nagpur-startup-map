import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  Tag,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getCityBySlug, getAllCities } from "@/lib/cities";
import { getEventBySlug } from "@/lib/queries/events";
import { getEventsForCity } from "@/lib/data";

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateStaticParams() {
  const allPublished = await getAllCities();
  const paramsList: Array<{ city: string; slug: string }> = [];

  for (const city of allPublished) {
    const events = getEventsForCity(city.slug);
    for (const e of events) {
      paramsList.push({
        city: city.slug,
        slug: e.slug,
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };

  const event = await getEventBySlug(slug, city.id);
  if (!event) return { title: "Event Not Found" };

  const cityName = city.name;
  const canonicalUrl = `${SITE.url}/${city.slug}/event/${slug}`;

  return {
    title: `${event.title} — ${cityName} Tech Event | ${cityName} Startup Map`,
    description: event.description || `Attend ${event.title} in ${cityName}. Details, schedule, venue and registration.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${event.title} — ${cityName}`,
      description: event.description || `${event.title} in ${cityName}`,
      url: canonicalUrl,
      images: event.imageUrl ? [{ url: event.imageUrl }] : undefined,
    },
  };
}

export default async function CityEventPage({ params }: Props) {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const event = await getEventBySlug(slug, city.id);
  if (!event) notFound();

  const cityName = city.name;

  // Schema.org Event Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date ? new Date(event.date).toISOString() : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue || cityName,
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressRegion: city.state,
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
    },
    offers: {
      "@type": "Offer",
      price: event.price === "Free" || !event.price ? "0" : event.price,
      priceCurrency: "INR",
      url: event.registrationUrl,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { label: `${cityName} Hub`, href: `/${city.slug}` },
            { label: "Events", href: `/${city.slug}/events` },
            { label: event.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {event.eventType}
                </span>
                <span className="text-xs text-muted-foreground">
                  Organized by {event.organizer}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {event.title}
              </h1>

              {/* Event meta pills */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground py-4 border-y border-dashed">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {formatDate(event.date)}
                  </span>
                </div>

                {(event.startTime || event.endTime) && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {event.startTime} {event.endTime ? `– ${event.endTime}` : ""}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location || event.venue || cityName}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-4">
                <h2 className="text-lg font-bold">About the Event</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Action Button */}
              {event.registrationUrl && (
                <div className="mt-8 pt-6 border-t flex flex-wrap gap-3">
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <span>Register / RSVP for Event</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Event Logistics
              </h3>

              <div className="space-y-3 divide-y divide-border/60 text-sm">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Organizer</span>
                  <span className="font-semibold text-foreground text-right">
                    {event.organizer}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {event.price || "Free"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-semibold text-foreground text-right">
                    {event.venue || cityName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
