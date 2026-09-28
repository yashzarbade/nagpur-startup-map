import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Building2,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getCityBySlug, getAllCities } from "@/lib/cities";
import {
  getJobBySlugWithStatus,
  getRelatedJobs,
  getActiveJobsByCompany,
} from "@/lib/queries/jobs";
import { getJobsForCity } from "@/lib/data";

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateStaticParams() {
  const allPublished = await getAllCities();
  const paramsList: Array<{ city: string; slug: string }> = [];

  for (const city of allPublished) {
    const jobs = getJobsForCity(city.slug);
    for (const j of jobs) {
      paramsList.push({
        city: city.slug,
        slug: j.slug,
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };

  const job = await getJobBySlugWithStatus(slug);
  if (!job) return { title: "Job Not Found" };

  const cityName = city.name;
  const canonicalUrl = `${SITE.url}/${city.slug}/job/${slug}`;

  return {
    title: `${job.title} at ${job.companyName} — ${cityName} Jobs | ${cityName} Startup Map`,
    description: `Apply for ${job.title} at ${job.companyName} in ${job.location || cityName}. Explore requirements, compensation, and startup careers in ${cityName}.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${job.title} at ${job.companyName} — ${cityName}`,
      description: `Job opening at ${job.companyName} in ${job.location || cityName}.`,
      url: canonicalUrl,
    },
  };
}

export default async function CityJobPage({ params }: Props) {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const job = await getJobBySlugWithStatus(slug);
  if (!job) notFound();

  const cityName = city.name;
  const isExpired = job.status !== "ACTIVE";

  const [relatedJobs, activeCompanyJobs] = await Promise.all([
    getRelatedJobs(job.id, job.companyId, 4, city.id),
    getActiveJobsByCompany(job.companyId),
  ]);

  const skillsList = job.skills
    ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Schema.org JobPosting Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt ? new Date(job.postedAt).toISOString() : undefined,
    validThrough: job.expiresAt ? new Date(job.expiresAt).toISOString() : undefined,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      logo: job.companyLogo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressRegion: city.state,
        addressCountry: "IN",
      },
    },
    ...(job.salaryMin && job.salaryMax
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.currency || "INR",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryMin,
              maxValue: job.salaryMax,
              unitText: "YEAR",
            },
          },
        }
      : {}),
  };

  return (
    <>
      {!isExpired && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { label: `${cityName} Hub`, href: `/${city.slug}` },
            { label: "Jobs", href: `/${city.slug}/jobs` },
            { label: job.title },
          ]}
        />

        {/* Expired Job Notice Banner */}
        {isExpired && (
          <div className="my-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-900 dark:text-amber-200 shadow-xs flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base">This job is no longer active.</h3>
              <p className="text-sm mt-1 text-amber-800/90 dark:text-amber-300/90">
                This position has closed or was expired during the latest synchronization. Explore alternative openings below.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-muted/40 overflow-hidden p-2">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`${job.companyName} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold sm:text-3xl text-foreground">
                    {job.title}
                  </h1>
                  <div className="mt-1">
                    <Link
                      href={`/${city.slug}/company/${job.companySlug}`}
                      className="text-base font-semibold text-primary hover:underline"
                    >
                      {job.companyName}
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {job.location || cityName}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-foreground">
                      {job.remoteType}
                    </span>
                    <span>•</span>
                    <span>{job.employmentType}</span>
                    {job.postedAt && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Posted {formatDate(job.postedAt)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t flex flex-wrap items-center gap-3">
                {!isExpired && job.applicationUrl ? (
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <span>Apply on Company Website</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}

                <Link
                  href={`/${city.slug}/company/${job.companySlug}`}
                  className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-semibold hover:bg-accent transition-colors"
                >
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>View Company Profile</span>
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold">Role Description</h2>
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description || "Refer to the official application destination for comprehensive job details and technical qualifications."}
              </div>

              {/* Skills */}
              {skillsList.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Desired Skills &amp; Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-primary/10 text-primary font-medium text-xs px-3 py-1 border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="rounded-2xl border bg-card p-6 shadow-2xs">
                <h2 className="text-lg font-bold mb-4">
                  More Open Roles in {cityName}
                </h2>
                <div className="space-y-3">
                  {relatedJobs.map((rj) => (
                    <Link
                      key={rj.id}
                      href={`/${city.slug}/job/${rj.slug}`}
                      className="block p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="font-bold text-sm sm:text-base text-foreground">
                        {rj.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-medium text-primary">
                          {rj.companyName}
                        </span>
                        <span>•</span>
                        <span>{rj.location || cityName}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Job Overview
              </h3>

              <div className="space-y-3 divide-y divide-border/60 text-sm">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-semibold text-foreground">
                    {job.department || "Engineering"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-semibold text-foreground">
                    {job.experienceMin !== null && job.experienceMin !== undefined
                      ? `${job.experienceMin}+ years`
                      : "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Workplace</span>
                  <span className="font-semibold text-foreground">
                    {job.remoteType}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-muted-foreground">Job Type</span>
                  <span className="font-semibold text-foreground">
                    {job.employmentType}
                  </span>
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-muted-foreground">Compensation</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{(job.salaryMin / 100000).toFixed(1)} - ₹{(job.salaryMax / 100000).toFixed(1)} LPA
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
