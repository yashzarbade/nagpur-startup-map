"use client";

import Link from "next/link";
import { Building2, MapPin, Users, ExternalLink } from "lucide-react";
import { cn, companyUrl, truncate } from "@/lib/utils";

interface CompanyCardProps {
  name: string;
  slug: string;
  logoUrl?: string | null;
  descriptionShort?: string | null;
  sector?: string | null;
  companyType?: string | null;
  locationName?: string | null;
  hiring?: boolean;
  teamSize?: string | null;
  featured?: boolean;
  verificationStatus?: string;
  className?: string;
}

export function CompanyCard({
  name,
  slug,
  logoUrl,
  descriptionShort,
  sector,
  companyType,
  locationName,
  hiring,
  teamSize,
  featured,
  verificationStatus,
  className,
}: CompanyCardProps) {
  return (
    <Link
      href={companyUrl(slug)}
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-5 card-hover",
        featured && "ring-2 ring-amber-200 border-amber-200",
        className
      )}
    >
      {/* Featured badge */}
      {featured && (
        <span className="badge-featured absolute top-3 right-3">
          ✦ Featured
        </span>
      )}

      {/* Logo + Name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50 overflow-hidden p-1">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-full w-full object-contain"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <Building2 className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {companyType && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border">
                {companyType}
              </span>
            )}
            {sector && (
              <span className="text-xs text-muted-foreground">{sector}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {descriptionShort && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {truncate(descriptionShort, 120)}
        </p>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t">
        {locationName && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {locationName}
          </span>
        )}
        {teamSize && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {teamSize}
          </span>
        )}
        {hiring && (
          <span className="badge-hiring ml-auto">
            Hiring
          </span>
        )}
      </div>

      {/* Verified indicator */}
      {verificationStatus === "VERIFIED" && (
        <div className="absolute bottom-3 right-3">
          <span className="text-blue-500 text-xs" title="Verified">✓</span>
        </div>
      )}
    </Link>
  );
}
