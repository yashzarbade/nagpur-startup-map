import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Globe,
  Link2,
  MapPin,
  Users,
  Calendar,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Clock,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  getAllCompanies,
  getCompanyBySlug,
  getFoundersByCompany,
  getJobsByCompany,
} from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCompanies().map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: "Company Not Found" };

  return {
    title: `${company.name} — Startup & Tech Company in Nagpur`,
    description: `Learn about ${company.name}, a ${company.sector} company in ${company.locationName}, Nagpur. Explore its profile, founders, location and active job openings.`,
    alternates: { canonical: `/company/${slug}` },
    openGraph: {
      title: `${company.name} — Startup in Nagpur | ${SITE.name}`,
      description: company.descriptionShort,
      url: `${SITE.url}/company/${slug}`,
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

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const rawCompany = getCompanyBySlug(slug);

  if (!rawCompany) {
    notFound();
  }

  const founders = getFoundersByCompany(slug);
  const jobs = getJobsByCompany(slug);

  const company = {
    ...rawCompany,
    founders,
    jobs,
  };

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Startups", href: "/startups" },
          ...(company.sector
            ? [{ label: company.sector, href: `/startups/${company.sector.toLowerCase().replace(/\s+/g, "-")}` }]
            : []),
          { label: company.name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border bg-muted/50 overflow-hidden">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={`${company.name} logo`} className="h-full w-full object-contain p-2" />
          ) : (
            <Building2 className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
            {company.companyType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border">
                {company.companyType}
              </span>
            )}
            {company.hiring && <span className="badge-hiring">Hiring</span>}
            {company.verificationStatus === "VERIFIED" && (
              <span className="badge-verified">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
          {company.descriptionShort && (
            <p className="text-muted-foreground mt-1">{company.descriptionShort}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {company.websiteUrl && (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Globe className="h-4 w-4" />
                Visit Website
              </a>
            )}
            {company.careersUrl && (
              <a
                href={company.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                View Jobs
              </a>
            )}
            {company.linkedinUrl && (
              <a
                href={company.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Link2 className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {company.descriptionLong && (
            <section>
              <h2 className="text-lg font-semibold mb-3">About {company.name}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {company.descriptionLong}
              </p>
            </section>
          )}

          {/* Founders */}
          {company.founders && company.founders.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Founders</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {company.founders.map((founder: any) => (
                  <Link
                    key={founder.slug}
                    href={`/founder/${founder.slug}`}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {founder.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{founder.name}</p>
                      <p className="text-xs text-muted-foreground">{founder.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Open Jobs */}
          {company.jobs && company.jobs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">
                Open Positions ({company.jobs.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {company.jobs.map((job: any) => (
                  <JobCard key={job.slug} {...job} />
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {company.tags && company.tags.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {company.tags.map((tag: string) => (
                  <span key={tag} className="badge-sector">{tag}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — Quick Facts */}
        <div className="space-y-6">
          <div className="rounded-xl border p-5 space-y-4">
            <h3 className="font-semibold text-sm">Quick Facts</h3>
            <div className="space-y-3 text-sm">
              {company.companyType && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Company Type</p>
                    <p className="font-medium">{company.companyType}</p>
                  </div>
                </div>
              )}
              {company.sector && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sector</p>
                    <Link href={`/startups/${company.sector.toLowerCase().replace(/\s+/g, "-")}`} className="font-medium text-primary hover:underline">
                      {company.sector}
                    </Link>
                  </div>
                </div>
              )}
              {company.locationName && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{company.locationName}, Nagpur</p>
                  </div>
                </div>
              )}
              {company.foundedYear && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Founded</p>
                    <p className="font-medium">{company.foundedYear}</p>
                  </div>
                </div>
              )}
              {company.stage && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="font-medium">{stageLabels[company.stage] || company.stage}</p>
                  </div>
                </div>
              )}
              {company.teamSize && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Team Size</p>
                    <p className="font-medium">{company.teamSize} people</p>
                  </div>
                </div>
              )}
              {company.hiring !== undefined && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Hiring</p>
                    <p className="font-medium">{company.hiring ? "Yes — actively hiring" : "Not currently hiring"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Last Verified */}
          {company.lastVerifiedAt && (
            <div className="rounded-xl border p-5">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last verified:</span>
                <span className="font-medium">{formatDate(company.lastVerifiedAt, { month: "long", year: "numeric" })}</span>
              </div>
            </div>
          )}

          {/* Claim CTA */}
          <div className="rounded-xl border border-dashed p-5 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Are you from this company?
            </p>
            <Link
              href={`/claim/${slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Claim this profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: company.name,
            url: company.websiteUrl || `${SITE.url}/company/${slug}`,
            description: company.descriptionShort,
            ...(company.foundedYear ? { foundingDate: `${company.foundedYear}` } : {}),
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nagpur",
              addressRegion: "Maharashtra",
              addressCountry: "IN",
            },
            ...(company.linkedinUrl ? { sameAs: [company.linkedinUrl] } : {}),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
