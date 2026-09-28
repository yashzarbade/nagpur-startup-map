import Link from "next/link";
import { MapPin, Clock, Briefcase, IndianRupee, Building2 } from "lucide-react";
import { cn, jobUrl, companyUrl, formatSalary, formatExperience, getRelativeTime, getFreshnessLevel } from "@/lib/utils";

interface JobCardProps {
  title: string;
  slug: string;
  companyName: string;
  companySlug: string;
  citySlug?: string;
  cityId?: number | null;
  companyLogo?: string | null;
  location?: string | null;
  remoteType?: string | null;
  employmentType?: string | null;
  experienceMin?: number | null;
  experienceMax?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  skills?: string | null;
  postedAt: Date | string;
  featured?: boolean;
  className?: string;
}

const remoteLabels: Record<string, string> = {
  ON_SITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

const employmentLabels: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

export function JobCard({
  title,
  slug,
  companyName,
  companySlug,
  citySlug,
  cityId,
  companyLogo,
  location,
  remoteType,
  employmentType,
  experienceMin,
  experienceMax,
  salaryMin,
  salaryMax,
  currency,
  skills,
  postedAt,
  featured,
  className,
}: JobCardProps) {
  const activeCity =
    citySlug ||
    (cityId === 3 ? "indore" : cityId === 1 ? "nagpur" : undefined) ||
    (location?.toLowerCase().includes("indore") ? "indore" : "nagpur");

  const freshness = getFreshnessLevel(postedAt);

  return (
    <div
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

      {/* Freshness badge */}
      {freshness === "new" && !featured && (
        <span className="badge-new absolute top-3 right-3">New</span>
      )}

      {/* Company info */}
      <div className="flex items-start gap-3 mb-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 overflow-hidden">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="h-full w-full object-contain p-1"
              loading="lazy"
            />
          ) : (
            <Building2 className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={jobUrl(slug, activeCity)}
            className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1 block"
          >
            {title}
          </Link>
          <Link
            href={companyUrl(companySlug, activeCity)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {companyName}
          </Link>
        </div>
      </div>

      {/* Job details */}
      <div className="flex flex-wrap gap-2 mt-2 mb-3">
        {location && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
        )}
        {remoteType && remoteLabels[remoteType] && (
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
            {remoteLabels[remoteType]}
          </span>
        )}
        {employmentType && employmentLabels[employmentType] && (
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
            {employmentLabels[employmentType]}
          </span>
        )}
      </div>

      {/* Salary + Experience */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        {(salaryMin || salaryMax) && (
          <span className="flex items-center gap-1">
            <IndianRupee className="h-3 w-3" />
            {formatSalary(salaryMin, salaryMax, currency || "INR")}
          </span>
        )}
        {(experienceMin !== null || experienceMax !== null) && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {formatExperience(experienceMin, experienceMax)}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills && (
        <div className="flex flex-wrap gap-1 mb-3">
          {skills
            .split(",")
            .slice(0, 4)
            .map((skill) => (
              <span
                key={skill.trim()}
                className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {skill.trim()}
              </span>
            ))}
          {skills.split(",").length > 4 && (
            <span className="text-[10px] text-muted-foreground">
              +{skills.split(",").length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Posted date */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {getRelativeTime(postedAt)}
        </span>
        <Link
          href={jobUrl(slug)}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
