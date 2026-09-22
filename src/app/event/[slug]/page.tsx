import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Share2,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EventCard } from "@/components/event-card";
import { SITE } from "@/lib/constants";
import { getAllEvents, getEventBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllEvents().map((e) => ({
    slug: e.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title} — Tech Event in Nagpur`,
    description: `${event.title} organized by ${event.organizer} on ${event.date} at ${event.venue}, Nagpur.`,
    alternates: { canonical: `/event/${slug}` },
    openGraph: {
      title: `${event.title} | ${SITE.name}`,
      description: event.description,
      url: `${SITE.url}/event/${slug}`,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const otherEvents = getAllEvents().filter((e) => e.slug !== event.slug).slice(0, 3);

  // Schema.org Event JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nagpur",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
    },
    offers: {
      "@type": "Offer",
      price: event.price === "Free" ? "0" : event.price.replace(/[^\d]/g, ""),
      priceCurrency: "INR",
      url: event.registrationUrl || `${SITE.url}/event/${slug}`,
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
            { label: "Events", href: "/events" },
            { label: event.title },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-3 mt-4">
          {/* Main Event Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {event.eventType}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                  {event.price}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold">{event.title}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t text-sm">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-semibold">{event.startTime} {event.endTime ? `– ${event.endTime}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 sm:col-span-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="font-semibold">{event.venue}, {event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h2 className="text-lg font-bold">About the Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {event.description}
              </p>
            </div>

            {/* Organizer Block */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Organized By
              </h2>
              <p className="text-base font-semibold">{event.organizer}</p>
              <p className="text-xs text-muted-foreground">
                Nagpur local community organization fostering technology, entrepreneurship, and collaboration in Central India.
              </p>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Admission</span>
                <span className="text-2xl font-bold text-primary">{event.price}</span>
              </div>

              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
                >
                  Register / RSVP Now <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <div className="w-full text-center py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                  Walk-in / Open Event
                </div>
              )}

              <div className="pt-3 border-t text-xs text-muted-foreground space-y-2">
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="font-medium text-foreground">{event.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Type</span>
                  <span className="font-medium text-foreground">{event.eventType}</span>
                </div>
              </div>
            </div>

            {/* More Events */}
            {otherEvents.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">More Upcoming Events</h3>
                <div className="space-y-3">
                  {otherEvents.map((e) => (
                    <EventCard key={e.slug} {...e} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
