import Link from "next/link";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { cn, eventUrl, formatDate } from "@/lib/utils";

interface EventCardProps {
  title: string;
  slug: string;
  citySlug?: string;
  cityId?: number | null;
  description?: string | null;
  eventType?: string | null;
  organizer?: string | null;
  date: Date | string;
  startTime?: string | null;
  venue?: string | null;
  location?: string | null;
  registrationUrl?: string | null;
  price?: string | null;
  featured?: boolean;
  className?: string;
}

const eventTypeLabels: Record<string, string> = {
  MEETUP: "Meetup",
  HACKATHON: "Hackathon",
  WORKSHOP: "Workshop",
  DEMO_DAY: "Demo Day",
  NETWORKING: "Networking",
  CONFERENCE: "Conference",
  STARTUP_PITCH: "Startup Pitch",
  COLLEGE_EVENT: "College Event",
  OTHER: "Event",
};

const eventTypeColors: Record<string, string> = {
  MEETUP: "bg-blue-50 text-blue-700",
  HACKATHON: "bg-purple-50 text-purple-700",
  WORKSHOP: "bg-green-50 text-green-700",
  DEMO_DAY: "bg-orange-50 text-orange-700",
  NETWORKING: "bg-pink-50 text-pink-700",
  CONFERENCE: "bg-indigo-50 text-indigo-700",
  STARTUP_PITCH: "bg-amber-50 text-amber-700",
  COLLEGE_EVENT: "bg-teal-50 text-teal-700",
  OTHER: "bg-gray-50 text-gray-700",
};

export function EventCard({
  title,
  slug,
  citySlug,
  cityId,
  description,
  eventType,
  organizer,
  date,
  startTime,
  venue,
  location,
  registrationUrl,
  price,
  featured,
  className,
}: EventCardProps) {
  const d = new Date(date);
  const month = d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const day = d.getDate();

  const activeCity =
    citySlug ||
    (cityId === 3 ? "indore" : cityId === 1 ? "nagpur" : undefined) ||
    (location?.toLowerCase().includes("indore") || venue?.toLowerCase().includes("indore")
      ? "indore"
      : "nagpur");

  return (
    <Link
      href={eventUrl(slug, activeCity)}
      className={cn(
        "group relative flex rounded-xl border bg-card overflow-hidden card-hover",
        featured && "ring-2 ring-amber-200 border-amber-200",
        className
      )}
    >
      {/* Date block */}
      <div className="flex flex-col items-center justify-center w-20 shrink-0 bg-primary/5 border-r px-3 py-4">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
          {month}
        </span>
        <span className="text-2xl font-bold text-foreground leading-none mt-0.5">
          {day}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          {eventType && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
                eventTypeColors[eventType] || eventTypeColors.OTHER
              )}
            >
              {eventTypeLabels[eventType] || "Event"}
            </span>
          )}
          {price && (
            <span className="text-[10px] font-medium text-muted-foreground ml-auto shrink-0">
              {price}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>

        {organizer && (
          <p className="text-xs text-muted-foreground mt-0.5">
            by {organizer}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
          {startTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {startTime}
            </span>
          )}
          {(venue || location) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{venue || location}</span>
            </span>
          )}
        </div>

        {featured && (
          <span className="badge-featured absolute top-2 right-2">
            ✦ Featured
          </span>
        )}
      </div>
    </Link>
  );
}
