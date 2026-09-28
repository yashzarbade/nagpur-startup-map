import Link from "next/link";
import {
  Search,
  ArrowRight,
  Building2,
  Briefcase,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  Plus,
  Sparkles,
} from "lucide-react";
import { SECTORS } from "@/lib/constants";
import { CompanyCard } from "@/components/company-card";
import { JobCard } from "@/components/job-card";
import { EventCard } from "@/components/event-card";
import { StartupMap } from "@/components/startup-map";
import { EmptyState } from "@/components/empty-state";
import { getCompanies, getHiringCompanies, getRecentCompanies, getCityMapCompanies } from "@/lib/queries/companies";
import { getLatestJobs, countActiveJobs } from "@/lib/queries/jobs";
import { getUpcomingEvents } from "@/lib/queries/events";
import { getEcosystemStats } from "@/lib/queries/stats";
import type { City } from "@/types";

interface CityOverviewProps {
  city: City;
}

export async function CityOverview({ city }: CityOverviewProps) {
  const cityId = city.id;
  const cityName = city.name;
  const citySlug = city.slug;

  const [stats, hiringResult, latestJobs, upcomingEvents, recentResult, mapCompanies] =
    await Promise.all([
      getEcosystemStats(cityId),
      getHiringCompanies(1, cityId),
      getLatestJobs(6, cityId),
      getUpcomingEvents(3, cityId),
      getRecentCompanies(6, cityId),
      getCityMapCompanies(cityId, citySlug),
    ]);

  const hiringCompanies = hiringResult.companies;
  const recentCompanies = recentResult;

  const lat = city.latitude ? parseFloat(city.latitude) : 21.1458;
  const lng = city.longitude ? parseFloat(city.longitude) : 79.0882;

  return (
    <>
      {/* ═══════════════ Section 1: Hero ═══════════════ */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="bg-pattern absolute inset-0 opacity-40" />
        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* City Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground mb-4">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{cityName}, {city.state} Ecosystem</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover {cityName}&apos;s{" "}
              <span className="text-gradient">startups, tech companies</span>
              , jobs and opportunities.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Explore startups, technology companies, founders, jobs, events and
              emerging businesses across {cityName}.
            </p>

            {/* Search bar */}
            <div className="mt-8 mx-auto max-w-xl">
              <Link
                href={`/${citySlug}/startups?search=true`}
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 text-muted-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/30 group"
              >
                <Search className="h-5 w-5 transition-colors group-hover:text-primary" />
                <span className="text-sm">
                  Search startups, sectors, technologies in {cityName}...
                </span>
                <kbd className="ml-auto hidden rounded border bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline-block">
                  Browse All
                </kbd>
              </Link>
            </div>

            {/* Quick stats pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
              <Link
                href={`/${citySlug}/startups`}
                className="flex items-center gap-2 rounded-lg border bg-card/80 px-3.5 py-1.5 transition-colors hover:border-primary/50"
              >
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {stats.totalCompanies}
                </span>
                <span className="text-muted-foreground">Companies</span>
              </Link>
              <Link
                href={`/${citySlug}/jobs`}
                className="flex items-center gap-2 rounded-lg border bg-card/80 px-3.5 py-1.5 transition-colors hover:border-primary/50"
              >
                <Briefcase className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-foreground">
                  {stats.totalJobs}
                </span>
                <span className="text-muted-foreground">Open Roles</span>
              </Link>
              <Link
                href={`/${citySlug}/events`}
                className="flex items-center gap-2 rounded-lg border bg-card/80 px-3.5 py-1.5 transition-colors hover:border-primary/50"
              >
                <Calendar className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-foreground">
                  {stats.totalEvents}
                </span>
                <span className="text-muted-foreground">Events</span>
              </Link>
              <Link
                href={`/${citySlug}/founders`}
                className="flex items-center gap-2 rounded-lg border bg-card/80 px-3.5 py-1.5 transition-colors hover:border-primary/50"
              >
                <Users className="h-4 w-4 text-purple-500" />
                <span className="font-semibold text-foreground">
                  {stats.totalFounders}
                </span>
                <span className="text-muted-foreground">Founders</span>
              </Link>
              <Link
                href={`/walkins/${citySlug}`}
                className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 px-3.5 py-1.5 transition-colors hover:border-purple-500/50"
              >
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-foreground">
                  Walk-In Drives
                </span>
                <span className="text-muted-foreground">Direct Hiring</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 2: Interactive Map ═══════════════ */}
      <section className="container-page py-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {cityName} Startup Ecosystem Map
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Explore tech companies, innovation hubs, and startups across {cityName}
            </p>
          </div>
          <Link
            href={`/${citySlug}/startups`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <span>View All Startups</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <StartupMap
          cityName={cityName}
          citySlug={citySlug}
          center={[lng, lat]}
          zoom={11}
          companiesList={mapCompanies}
        />
      </section>

      {/* ═══════════════ Section 3: Actively Hiring ═══════════════ */}
      {hiringCompanies.length > 0 && (
        <section className="border-t bg-muted/20 py-12">
          <div className="container-page">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Actively Hiring in {cityName}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Startups building their teams right now
                </p>
              </div>
              <Link
                href={`/${citySlug}/hiring`}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <span>View all hiring ({stats.hiringCompanies})</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hiringCompanies.map((company: any) => (
                <CompanyCard key={company.id} {...company} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ Section 4: Latest Jobs ═══════════════ */}
      {latestJobs.length > 0 && (
        <section className="container-page py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Latest Jobs in {cityName}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Fresh opportunities across engineering, product, design and more
              </p>
            </div>
            <Link
              href={`/${citySlug}/jobs`}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <span>View all jobs ({stats.totalJobs})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {latestJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════ Section 5: Sectors ═══════════════ */}
      <section className="border-t bg-muted/20 py-12">
        <div className="container-page">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Explore by Sector in {cityName}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {SECTORS.slice(0, 12).map((s) => (
              <Link
                key={s.slug}
                href={`/${citySlug}/startups/${s.slug}`}
                className="group rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs text-center"
              >
                <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {s.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Startups</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 6: CTA ═══════════════ */}
      <section className="container-page py-16">
        <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Building a startup in {cityName}?
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Get your company, open jobs, and tech events featured on the {cityName} Startup Map.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your Startup</span>
            </Link>
            <Link
              href="/submit/job"
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-colors"
            >
              <span>Post a Job</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
