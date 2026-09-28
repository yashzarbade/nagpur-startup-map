import Link from "next/link";
import { MapPin, Calendar, Clock, Building2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WalkinCard as WalkinCardType } from "@/types";

interface WalkinCardProps {
  walkin: WalkinCardType;
  className?: string;
}

export function WalkinCard({ walkin, className }: WalkinCardProps) {
  const walkinDate = new Date(walkin.walkinDate);
  const isPast = walkinDate.getTime() < Date.now();
  const dateFormatted = walkinDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-5 card-hover transition-all",
        walkin.featured && "ring-2 ring-amber-200 border-amber-200",
        isPast && "opacity-75 bg-muted/20",
        className
      )}
    >
      {/* Badges top-right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {walkin.featured && (
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
            ✦ Featured
          </span>
        )}
        {isPast ? (
          <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600">
            Expired
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
            Upcoming Drive
          </span>
        )}
      </div>

      {/* Date Banner */}
      <div className="mb-3.5 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary self-start">
        <Calendar className="h-3.5 w-3.5" />
        <span>{dateFormatted}</span>
        {walkin.walkinStartTime && (
          <>
            <span className="opacity-40">•</span>
            <Clock className="h-3.5 w-3.5" />
            <span>
              {walkin.walkinStartTime}
              {walkin.walkinEndTime ? ` - ${walkin.walkinEndTime}` : ""}
            </span>
          </>
        )}
      </div>

      {/* Company & Title Header */}
      <div className="flex items-start gap-3 mb-2.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-muted/40 overflow-hidden">
          {walkin.companyLogo ? (
            <img
              src={walkin.companyLogo}
              alt={`${walkin.companyName} logo`}
              className="h-full w-full object-contain p-1"
              loading="lazy"
            />
          ) : (
            <Building2 className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground line-clamp-1">
            {walkin.companyName}
          </span>
          <Link
            href={`/walkins/${walkin.slug}`}
            className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
          >
            {walkin.title}
          </Link>
        </div>
      </div>

      {/* Venue & Location */}
      <div className="mt-2 space-y-1.5 text-xs text-muted-foreground flex-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="line-clamp-1 font-medium text-foreground">
            {walkin.cityName || "Central India"}
            {walkin.location ? ` • ${walkin.location}` : ""}
          </span>
        </div>

        {walkin.walkinVenue && (
          <div className="text-xs text-muted-foreground line-clamp-2 pl-5 bg-muted/30 p-1.5 rounded">
            <strong>Venue:</strong> {walkin.walkinVenue}
          </div>
        )}
      </div>

      {/* Skills or Requirements */}
      {walkin.skills && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {walkin.skills
            .split(",")
            .slice(0, 3)
            .map((s, idx) => (
              <span
                key={idx}
                className="inline-block rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {s.trim()}
              </span>
            ))}
        </div>
      )}

      {/* Footer / Attribution / CTA */}
      <div className="mt-4 pt-3.5 border-t flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {walkin.verificationStatus === "VERIFIED" ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Walk-In
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              Source: {walkin.sourceType || "Direct Submission"}
            </span>
          )}
        </div>

        <Link
          href={`/walkins/${walkin.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-primary group-hover:underline"
        >
          View Venue & Details →
        </Link>
      </div>
    </div>
  );
}
