import Link from "next/link";
import { TrendingUp, Briefcase, Plus } from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getHiringCompanies } from "@/lib/queries/companies";
import type { City } from "@/types";

interface CityHiringViewProps {
  city: City;
}

export async function CityHiringView({ city }: CityHiringViewProps) {
  const cityId = city.id;
  const cityName = city.name;
  const citySlug = city.slug;

  const { companies: companyList, total } = await getHiringCompanies(1, cityId);

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: cityName, href: `/${citySlug}` },
          { label: "Hiring", href: `/${citySlug}/hiring` },
        ]}
      />

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 tracking-tight">
            <TrendingUp className="h-7 w-7 text-emerald-500" />
            Companies Hiring in {cityName}
          </h1>
          <p className="text-muted-foreground mt-2">
            {total > 0
              ? `${total} companies actively hiring across ${cityName}'s startup and tech ecosystem`
              : `Explore startups and companies actively building teams in ${cityName}`}
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

      {companyList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companyList.map((company: any) => (
            <CompanyCard key={company.slug} {...company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No hiring companies listed in ${cityName} yet`}
          description={`Are you growing your engineering, product, or sales teams in ${cityName}? Post open positions to reach top tech talent.`}
          actionLabel="Post a Job"
          actionHref="/submit/job"
          secondaryLabel={`Explore ${cityName} Startups`}
          secondaryHref={`/${citySlug}/startups`}
        />
      )}

      {/* Post a job CTA */}
      <div className="mt-12 rounded-2xl border border-dashed p-8 text-center bg-card/40">
        <h3 className="text-lg font-semibold mb-1">Hiring in {cityName}?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Post your open positions to reach passionate tech talent and engineers in {cityName}.
        </p>
        <Link
          href="/submit/job"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Briefcase className="h-4 w-4" />
          Post a Job — Free
        </Link>
      </div>
    </div>
  );
}
