import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Globe,
  MapPin,
  Users,
  Calendar,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { SITE } from "@/lib/constants";
import { getCityBySlug, getAllCities } from "@/lib/cities";
import { getCompanyBySlug } from "@/lib/queries/companies";
import { getCompaniesForCity, getFoundersForCity, getJobsForCity } from "@/lib/data";

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateStaticParams() {
  const allPublished = await getAllCities();
  const paramsList: Array<{ city: string; slug: string }> = [];

  for (const city of allPublished) {
    const companies = getCompaniesForCity(city.slug);
    for (const c of companies) {
      paramsList.push({
        city: city.slug,
        slug: c.slug,
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };

  let company = await getCompanyBySlug(slug, city.id);
  if (!company) {
    const fallbackList = getCompaniesForCity(citySlug);
    company = fallbackList.find((c) => c.slug === slug) as any;
  }
  if (!company) return { title: "Company Not Found" };

  const cityName = city.name;
  const canonicalUrl = `${SITE.url}/${city.slug}/company/${slug}`;

  return {
    title: `${company.name} — Startup & Tech Company in ${cityName} | ${cityName} Startup Map`,
    description: company.descriptionShort || `Explore ${company.name}, a leading ${company.sector} technology company in ${cityName}.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${company.name} — ${cityName} Startup Map`,
      description: company.descriptionShort || `${company.name} profile, founders, and jobs in ${cityName}.`,
      url: canonicalUrl,
      images: company.logoUrl ? [{ url: company.logoUrl }] : undefined,
    },
  };
}

const stageLabels: Record<string, string> = {
  BOOTSTRAPPED: "Bootstrapped",
  PRE_SEED: "Pre-Seed",
  SEED: "Seed",
  SERIES_A: "Series A",
  SERIES_B: "Series B",
  SERIES_C: "Series C+",
  GROWTH: "Growth",
  PUBLIC: "Public",
  ACQUIRED: "Acquired",
  UNKNOWN: "—",
};

export default async function CityCompanyPage({ params }: Props) {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  let company = await getCompanyBySlug(slug, city.id);
  if (!company) {
    // Fallback to static data if DB is offline
    const fallbackList = getCompaniesForCity(citySlug);
    const foundFallback = fallbackList.find((c) => c.slug === slug);
    if (!foundFallback) notFound();

    const cityFounders = getFoundersForCity(citySlug).filter((f: any) => f.companySlug === slug);
    const cityJobs = getJobsForCity(citySlug).filter((j: any) => j.companySlug === slug);

    company = {
      ...foundFallback,
      founders: cityFounders,
      jobs: cityJobs,
      tags: foundFallback.tags || [],
    } as any;
  }

  const cityName = city.name;
  const founders = company?.founders || [];
  const jobs = company?.jobs || [];
  const tags = company?.tags || [];

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company?.name,
    url: company?.websiteUrl,
    logo: company?.logoUrl,
    description: company?.descriptionShort,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressRegion: city.state,
      addressCountry: "IN",
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
            { label: "Startups", href: `/${city.slug}/startups` },
            ...(company?.sector
              ? [
                  {
                    label: company.sector,
                    href: `/${city.slug}/startups/${company.sector.toLowerCase().replace(/\s+/g, "-")}`,
                  },
                ]
              : []),
            { label: company?.name || slug },
          ]}
        />

        {/* Company Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-5 my-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border bg-card shadow-xs overflow-hidden p-2">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 className="h-10 w-10 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl text-foreground">
                {company?.name}
              </h1>
              {company?.companyType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-foreground border">
                  {company.companyType}
                </span>
              )}
              {company?.hiring && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Hiring
                </span>
              )}
              {company?.verificationStatus === "VERIFIED" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>

            {company?.descriptionShort && (
              <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
                {company.descriptionShort}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {company?.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>Visit Website</span>
                </a>
              )}
              {company?.careersUrl && (
                <a
                  href={company.careersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors"
                >
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Careers Portal</span>
                </a>
              )}
              {company?.linkedinUrl && (
                <a
                  href={company.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              )}

              <Link
                href={`/${city.slug}/claim/${company?.slug}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dashed px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors ml-auto"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Claim Company</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Company Overview & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Long Description */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                About {company?.name}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {company?.descriptionLong || company?.descriptionShort}
              </p>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-6 pt-6 border-t flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground"
                    >
                      <Tag className="h-3 w-3 opacity-60" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Founders Section */}
            {founders.length > 0 && (
              <div className="rounded-2xl border bg-card p-6 shadow-2xs">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Key Leadership &amp; Founders
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {founders.map((founder) => (
                    <div
                      key={founder.id}
                      className="rounded-xl border bg-muted/20 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-foreground">
                          {founder.name}
                        </div>
                        <div className="text-xs font-semibold text-primary mt-0.5">
                          {founder.role}
                        </div>
                        {founder.bio && (
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                            {founder.bio}
                          </p>
                        )}
                      </div>
                      {founder.linkedinUrl && (
                        <div className="mt-3 pt-2 border-t">
                          <a
                            href={founder.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" /> Connect on LinkedIn
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Jobs */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Open Positions ({jobs.length})
                </h2>
                {company?.careersUrl && (
                  <a
                    href={company.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    All Careers <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>

              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors gap-3"
                    >
                      <div>
                        <Link
                          href={`/${city.slug}/job/${job.slug}`}
                          className="font-bold text-sm sm:text-base hover:text-primary transition-colors"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                          <span>{job.department || "Engineering"}</span>
                          <span>•</span>
                          <span>{job.location || cityName}</span>
                          <span>•</span>
                          <span className="font-medium text-foreground">
                            {job.remoteType}
                          </span>
                        </div>
                      </div>

                      {job.applicationUrl && (
                        <a
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                        >
                          Apply Now
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm bg-muted/10 rounded-xl border border-dashed">
                  No direct open positions listed right now. Check back soon or visit their official careers portal.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Company Metadata
              </h3>

              <div className="space-y-3 divide-y divide-border/60 text-sm">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {company?.locationName}, {cityName}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Sector</span>
                  <span className="font-semibold text-foreground">
                    {company?.sector}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Stage</span>
                  <span className="font-semibold text-foreground">
                    {stageLabels[company?.stage || "UNKNOWN"] || company?.stage}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-semibold text-foreground">
                    {company?.foundedYear || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-semibold text-foreground">
                    {company?.teamSize || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {company?.verificationStatus === "VERIFIED" ? "Verified" : "Pending"}
                  </span>
                </div>

                {company?.lastVerifiedAt && (
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-muted-foreground">Verified Date</span>
                    <span className="font-semibold text-foreground">
                      {new Date(company.lastVerifiedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {company?.address && (
                <div className="pt-4 border-t text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-1">
                    Office Address:
                  </span>
                  {company.address}
                </div>
              )}

              {company?.latitude && company?.longitude && (
                <div className="pt-3 border-t">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${company.latitude},${company.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <MapPin className="h-3.5 w-3.5" /> View on Google Maps ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
