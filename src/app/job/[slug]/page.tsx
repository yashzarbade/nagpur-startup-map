import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Clock,
  Building2,
  ExternalLink,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { SITE } from "@/lib/constants";
import { formatSalary, formatDate } from "@/lib/utils";
import { getAllJobs, getJobBySlug, getCompanyBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllJobs().map((j) => ({
    slug: j.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} at ${job.companyName} in Nagpur`,
    description: `Apply for ${job.title} at ${job.companyName} in Nagpur. ${job.experienceMin}-${job.experienceMax} years experience. ${job.remoteType.replace("_", " ")}.`,
    alternates: { canonical: `/job/${slug}` },
    openGraph: {
      title: `${job.title} at ${job.companyName} | ${SITE.name}`,
      description: job.description.slice(0, 160),
      url: `${SITE.url}/job/${slug}`,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const company = getCompanyBySlug(job.companySlug);
  const otherJobs = getAllJobs().filter((j) => j.slug !== job.slug).slice(0, 3);

  // JobPosting JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    validThrough: job.expiresAt,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      sameAs: company?.websiteUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nagpur",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    baseSalary: job.salaryMin
      ? {
          "@type": "MonetaryAmount",
          currency: job.currency,
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salaryMin,
            maxValue: job.salaryMax,
            unitText: "YEAR",
          },
        }
      : undefined,
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
            { label: "Jobs", href: "/jobs" },
            { label: job.companyName, href: `/company/${job.companySlug}` },
            { label: job.title },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-3 mt-4">
          {/* Main Job Body */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={`/company/${job.companySlug}`}
                      className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
                    >
                      <Building2 className="h-4 w-4" /> {job.companyName}
                    </Link>
                    {company?.verificationStatus === "VERIFIED" && (
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
                </div>

                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shrink-0"
                >
                  Apply Directly <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Badges / Key Attributes */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg bg-muted">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {job.location}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-3.5 w-3.5" /> {job.remoteType.replace("_", " ")}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg bg-muted">
                  {job.employmentType.replace("_", " ")}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg bg-muted">
                  Exp: {job.experienceMin} - {job.experienceMax} yrs
                </span>
                {job.salaryMin && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h2 className="text-lg font-bold">About the Role</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {job.description}
              </p>

              {/* Skills */}
              {job.skills && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-2.5">Key Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.split(",").map((s) => (
                      <span
                        key={s.trim()}
                        className="px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Overview Block */}
            {company && (
              <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">About {company.name}</h2>
                  <Link
                    href={`/company/${company.slug}`}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    View company profile <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {company.descriptionLong || company.descriptionShort}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                  <span>Sector: <strong>{company.sector}</strong></span>
                  <span>Location: <strong>{company.locationName}, Nagpur</strong></span>
                  <span>Team Size: <strong>{company.teamSize}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-4">
              <h3 className="font-semibold text-sm">Job Overview</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Date Posted</p>
                  <p className="font-medium mt-0.5">{job.postedAt}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium mt-0.5">{job.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Workplace Type</p>
                  <p className="font-medium mt-0.5">{job.remoteType.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium mt-0.5">{job.location}, India</p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
                >
                  Apply on Company Site <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Other Jobs */}
            {otherJobs.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">More Jobs in Nagpur</h3>
                <div className="space-y-3">
                  {otherJobs.map((j) => (
                    <JobCard key={j.slug} {...j} />
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
