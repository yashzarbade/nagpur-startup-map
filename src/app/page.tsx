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
  Compass,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { JobCard } from "@/components/job-card";
import { StartupMap } from "@/components/startup-map";
import { getCompanies, getHiringCompanies } from "@/lib/queries/companies";
import { getLatestJobs, countActiveJobs } from "@/lib/queries/jobs";
import { getEcosystemStats } from "@/lib/queries/stats";
import { getAllCities } from "@/lib/cities";
import { COMPANIES_DATA } from "@/lib/data";

export default async function HomePage() {
  const [allCities, nagpurStats, indoreStats, hiringResult, latestJobs] = await Promise.all([
    getAllCities(),
    getEcosystemStats(1), // Nagpur city_id = 1
    getEcosystemStats(3), // Indore city_id = 3
    getHiringCompanies(1, 1),
    getLatestJobs(6, 1),
  ]);

  const hiringCompanies = hiringResult.companies.slice(0, 6);

  return (
    <>
      {/* ═══════════════ Section 1: Hero ═══════════════ */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="bg-pattern absolute inset-0 opacity-30" />
        <div className="container-page relative py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/70 px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-6 shadow-2xs">
              <Compass className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>Central India Tech • Innovation &amp; Startup Network</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Discover companies, startups, jobs, events &amp; opportunities across{" "}
              <span className="text-gradient">Central India</span>.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore verified technology companies, high-growth startups, real-time jobs, and emerging innovation ecosystems across Nagpur, Indore, and beyond.
            </p>

            {/* Global Search Bar */}
            <div className="mt-8 mx-auto max-w-xl">
              <Link
                href="/startups?search=true"
                className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 text-muted-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/40 group"
              >
                <Search className="h-5 w-5 transition-colors group-hover:text-primary" />
                <span className="text-sm">
                  Search startups, tech jobs, sectors, founders...
                </span>
                <kbd className="ml-auto hidden rounded-lg border bg-muted px-2.5 py-1 text-xs text-muted-foreground sm:inline-block font-mono">
                  Browse
                </kbd>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 2: City Hubs ═══════════════ */}
      <section className="container-page py-16 border-b">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Explore Regional Tech Hubs</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Select an ecosystem hub to explore its interactive map, verified directory, open roles, and tech events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Nagpur City Card (Live) */}
          <Link
            href="/nagpur"
            className="group relative flex flex-col justify-between rounded-3xl border bg-card p-7 shadow-xs transition-all hover:shadow-lg hover:border-primary/50 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 className="h-32 w-32 text-primary" />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Ecosystem
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Maharashtra
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                Nagpur Hub
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Central India&apos;s winter capital and premier innovation hub anchored by MIHAN SEZ, IT Park, IIM Nagpur, and {nagpurStats.totalCompanies}+ verified tech companies.
              </p>

              {/* City quick stats */}
              <div className="mt-6 grid grid-cols-3 gap-2 py-3 border-y border-dashed text-center">
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {nagpurStats.totalCompanies}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Startups</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-500">
                    {nagpurStats.totalJobs}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Open Roles</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-500">
                    {nagpurStats.totalFounders}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Founders</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-primary pt-2">
              <span>Explore Nagpur Hub</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Indore City Card (Live) */}
          <Link
            href="/indore"
            className="group relative flex flex-col justify-between rounded-3xl border bg-card p-7 shadow-xs transition-all hover:shadow-lg hover:border-blue-500/50 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
              <MapPin className="h-32 w-32 text-blue-500" />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Ecosystem
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Madhya Pradesh
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground group-hover:text-blue-500 transition-colors flex items-center gap-2">
                Indore Hub
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                India&apos;s cleanest city and commercial powerhouse, driven by Super Corridor tech parks, Crystal IT Park, IIT &amp; IIM Indore, and {indoreStats.totalCompanies}+ verified companies.
              </p>

              {/* City quick stats */}
              <div className="mt-6 grid grid-cols-3 gap-2 py-3 border-y border-dashed text-center">
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {indoreStats.totalCompanies}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Startups</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-500">
                    {indoreStats.totalJobs}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Open Roles</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-500">
                    {indoreStats.totalFounders}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Founders</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-blue-500 pt-2">
              <span>Launch Indore Ecosystem</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════ Section 3: Live Nagpur Map Preview ═══════════════ */}
      <section className="container-page py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live Interactive Visualization
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Nagpur Tech &amp; Startup Ecosystem
            </h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Explore 56+ verified technology companies across MIHAN SEZ, IT Park, Dharampeth, and Civil Lines.
            </p>
          </div>
          <Link
            href="/nagpur"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors self-start sm:self-auto shrink-0"
          >
            <span>Open Full Nagpur Map</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <StartupMap
          cityName="Nagpur"
          citySlug="nagpur"
          center={[79.0882, 21.1458]}
          zoom={11}
          companiesList={COMPANIES_DATA}
        />
      </section>

      {/* ═══════════════ Section 4: Live Hiring Startups ═══════════════ */}
      {hiringCompanies.length > 0 && (
        <section className="border-t bg-muted/20 py-16">
          <div className="container-page">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Startups Hiring Right Now
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Verified companies actively expanding their engineering and product teams
                </p>
              </div>
              <Link
                href="/nagpur/hiring"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <span>View all hiring</span>
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

      {/* ═══════════════ Section 5: Community CTA ═══════════════ */}
      <section className="container-page py-16">
        <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Building in an emerging tech hub?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Get your company, open jobs, and developer meetups listed on Startup Map. Free forever for the community.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add a Startup</span>
            </Link>
            <Link
              href="/submit/job"
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors"
            >
              <span>Post a Job</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
