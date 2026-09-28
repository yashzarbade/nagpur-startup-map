import Link from "next/link";
import { Briefcase, Plus, ArrowRight } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EMPLOYMENT_TYPES, REMOTE_TYPES, JOB_CATEGORIES } from "@/lib/constants";
import { getJobs } from "@/lib/queries/jobs";
import type { City } from "@/types";

interface CityJobsViewProps {
  city: City;
}

export async function CityJobsView({ city }: CityJobsViewProps) {
  const cityId = city.id;
  const cityName = city.name;
  const citySlug = city.slug;

  const { jobs: jobsList, total } = await getJobs({ cityId });

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: cityName, href: `/${citySlug}` },
          { label: "Jobs", href: `/${citySlug}/jobs` },
        ]}
      />

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Startup Jobs in {cityName}
          </h1>
          <p className="text-muted-foreground mt-2">
            {total > 0
              ? `${total} open positions at ${cityName}'s startups and tech companies`
              : `Explore technology and startup job openings across ${cityName}`}
          </p>
        </div>
        <Link
          href="/submit/job"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Post a Job</span>
        </Link>
      </div>

      {/* Quick category links */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
          Popular roles:
        </span>
        {JOB_CATEGORIES.slice(0, 6).map((cat) => (
          <Link
            key={cat.slug}
            href={`/${citySlug}/jobs?search=${encodeURIComponent(cat.label)}`}
            className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Jobs grid or empty state */}
      {jobsList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobsList.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No active jobs in ${cityName} right now`}
          description={`We haven't discovered active openings in ${cityName} yet. Hiring teams can post opportunities directly.`}
          actionLabel={`Explore ${cityName} Startups`}
          actionHref={`/${citySlug}/startups`}
          secondaryLabel="Post a Job"
          secondaryHref="/submit/job"
        />
      )}
    </div>
  );
}
