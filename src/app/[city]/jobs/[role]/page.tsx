import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, MapPin, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { SITE } from "@/lib/constants";
import { getCityBySlug, getAllCities } from "@/lib/cities";
import { getJobs } from "@/lib/queries/jobs";

type Props = {
  params: Promise<{ city: string; role: string }>;
};

const POPULAR_ROLES = [
  { slug: "software-engineer", label: "Software Engineer", query: "software" },
  { slug: "full-stack-developer", label: "Full Stack Developer", query: "full stack" },
  { slug: "ai-engineer", label: "AI / ML Engineer", query: "ai" },
  { slug: "backend-developer", label: "Backend Developer", query: "backend" },
  { slug: "frontend-developer", label: "Frontend Developer", query: "frontend" },
  { slug: "devops-engineer", label: "DevOps Engineer", query: "devops" },
  { slug: "customer-support", label: "Customer Support & Operations", query: "support" },
  { slug: "product-manager", label: "Product Manager", query: "product" },
];

export async function generateStaticParams() {
  const allPublished = await getAllCities();
  const paramsList: Array<{ city: string; role: string }> = [];

  for (const city of allPublished) {
    for (const r of POPULAR_ROLES) {
      paramsList.push({
        city: city.slug,
        role: r.slug,
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, role: roleSlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };

  const roleObj = POPULAR_ROLES.find((r) => r.slug === roleSlug);
  const roleLabel = roleObj?.label || roleSlug.replace(/-/g, " ");
  const cityName = city.name;
  const canonicalUrl = `${SITE.url}/${city.slug}/jobs/${roleSlug}`;

  return {
    title: `${roleLabel} Jobs in ${cityName} | ${cityName} Startup Map`,
    description: `Discover verified ${roleLabel} openings, salary insights, and startup careers in ${cityName}, ${city.state}.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${roleLabel} Jobs in ${cityName}`,
      description: `Explore ${roleLabel} roles in ${cityName}.`,
      url: canonicalUrl,
    },
  };
}

export default async function CityRoleJobsPage({ params }: Props) {
  const { city: citySlug, role: roleSlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const roleObj = POPULAR_ROLES.find((r) => r.slug === roleSlug);
  const roleLabel = roleObj?.label || roleSlug.replace(/-/g, " ");
  const searchQuery = roleObj?.query || roleSlug.replace(/-/g, " ");

  const cityName = city.name;
  const result = await getJobs({
    cityId: city.id,
    search: searchQuery,
    page: 1,
  });

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: `${cityName} Hub`, href: `/${city.slug}` },
          { label: "Jobs", href: `/${city.slug}/jobs` },
          { label: roleLabel },
        ]}
      />

      <div className="my-8">
        <Link
          href={`/${city.slug}/jobs`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all jobs
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {cityName} Role Directory
          </span>
        </div>
        <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">
          {roleLabel} Jobs in {cityName}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
          Browse verified {roleLabel.toLowerCase()} job openings and technical positions across top startups in {cityName}.
        </p>
      </div>

      {result.jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${roleLabel} jobs currently listed`}
          description={`We don't have active ${roleLabel.toLowerCase()} openings in ${cityName} right now. Check back as new jobs sync automatically daily.`}
          actionLabel={`View All ${cityName} Jobs`}
          actionHref={`/${city.slug}/jobs`}
        />
      )}
    </div>
  );
}
