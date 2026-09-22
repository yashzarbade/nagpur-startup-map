import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, Briefcase, Calendar, Users, Search, Filter, ArrowRight } from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SECTORS, AREAS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Startups & Tech Companies in Nagpur",
  description:
    "Explore startups, technology companies and software businesses in Nagpur. Find AI, SaaS, Fintech, Edtech, IT Services and more companies across Nagpur's growing startup ecosystem.",
  alternates: { canonical: "/startups" },
  openGraph: {
    title: "Startups & Tech Companies in Nagpur | Nagpur Startup Map",
    description: "Discover startups and technology companies in Nagpur.",
    url: `${SITE.url}/startups`,
  },
};

import { StartupMap } from "@/components/startup-map";
import { getAllCompanies } from "@/lib/data";

export default function StartupsPage() {
  const companies = getAllCompanies();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Startups", href: "/startups" }]} />

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Startups & Tech Companies in Nagpur
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover {companies.length} verified startups and technology companies across Nagpur&apos;s growing ecosystem.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
          Browse by sector:
        </span>
        <Link
          href="/startups"
          className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
        >
          All
        </Link>
        {SECTORS.filter((s) => s.slug !== "other").slice(0, 10).map((sector) => (
          <Link
            key={sector.slug}
            href={`/startups/${sector.slug}`}
            className="badge-sector"
          >
            {sector.label}
          </Link>
        ))}
      </div>

      {/* Area quick links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
          Areas:
        </span>
        {AREAS.slice(0, 8).map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MapPin className="h-3 w-3" />
            {area.label}
          </Link>
        ))}
      </div>

      {/* Interactive Mapbox Map */}
      <div className="mb-10">
        <StartupMap />
      </div>

      {/* Company grid header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          All Companies ({companies.length})
        </h2>
      </div>

      {/* Company grid */}
      {companies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.slug} {...company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No startups found"
          description="Try adjusting your filters or search to discover more companies."
          actionLabel="View all startups"
          actionHref="/startups"
          secondaryLabel="Add a startup"
          secondaryHref="/submit"
        />
      )}

      {/* Alphabetical directory link */}
      <div className="mt-12 text-center">
        <Link
          href="/startups/all"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Browse alphabetical directory A–Z
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
