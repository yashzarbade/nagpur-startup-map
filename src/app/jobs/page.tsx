import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE, EMPLOYMENT_TYPES, REMOTE_TYPES, JOB_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Startup Jobs in Nagpur",
  description:
    "Find startup and technology jobs in Nagpur. Browse software engineering, AI, full stack developer, product, design and other roles at Nagpur's startups and tech companies.",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "Startup Jobs in Nagpur | Nagpur Startup Map",
    description: "Find startup and technology jobs in Nagpur.",
    url: `${SITE.url}/jobs`,
  },
};

import { getAllJobs } from "@/lib/data";

export default function JobsPage() {
  const jobs = getAllJobs();
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Startup Jobs in Nagpur</h1>
        <p className="text-muted-foreground mt-2">
          {jobs.length} open positions at Nagpur&apos;s startups and tech companies
        </p>
      </div>

      {/* Quick category links */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
          Popular roles:
        </span>
        {JOB_CATEGORIES.slice(0, 8).map((cat) => (
          <Link
            key={cat.slug}
            href={`/jobs/${cat.slug}/nagpur`}
            className="badge-sector"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Job list */}
      {jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.slug} {...job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="No verified jobs here right now. Check back soon or explore hiring companies."
          actionLabel="View hiring companies"
          actionHref="/hiring"
          secondaryLabel="Post a job"
          secondaryHref="/submit/job"
        />
      )}
    </div>
  );
}
