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
import { SITE, SECTORS } from "@/lib/constants";
import { CompanyCard } from "@/components/company-card";
import { JobCard } from "@/components/job-card";
import { EventCard } from "@/components/event-card";
import { StartupMap } from "@/components/startup-map";
import {
  COMPANIES_DATA,
  JOBS_DATA,
  EVENTS_DATA,
  getFeaturedCompanies,
  getHiringCompanies,
  getStats,
} from "@/lib/data";

export default function HomePage() {
  const stats = getStats();
  const hiringCompanies = getHiringCompanies().slice(0, 6);
  const latestJobs = JOBS_DATA.slice(0, 6);
  const upcomingEvents = EVENTS_DATA.slice(0, 3);
  const recentCompanies = COMPANIES_DATA.slice(0, 6);

  return (
    <>
      {/* ═══════════════ Section 1: Hero ═══════════════ */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="bg-pattern absolute inset-0 opacity-40" />
        <div className="container-page relative py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Nagpur&apos;s{" "}
              <span className="text-gradient">startups, tech companies</span>
              , jobs and opportunities.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              Explore startups, technology companies, founders, jobs, events and
              emerging businesses across Nagpur.
            </p>

            {/* Search bar */}
            <div className="mt-8 mx-auto max-w-xl">
              <Link
                href="/startups?search=true"
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 text-muted-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/30 group"
              >
                <Search className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm">
                  Search startups, jobs, founders or sectors...
                </span>
                <kbd className="hidden sm:inline-flex ml-auto items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </Link>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/startups"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Explore Startups
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent w-full sm:w-auto"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Find Jobs
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Your Startup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 2: Ecosystem Statistics ═══════════════ */}
      <section className="border-b">
        <div className="container-page py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: stats.totalCompanies, label: "Startups & Companies", icon: Building2 },
              { value: stats.totalJobs, label: "Open Jobs", icon: Briefcase },
              { value: stats.totalFounders, label: "Founders", icon: Users },
              { value: stats.totalEvents, label: "Upcoming Events", icon: Calendar },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center animate-count-up stagger-${i + 1}`}
                style={{ opacity: 0 }}
              >
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <span className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 3: Explore by Sector ═══════════════ */}
      <section className="section-spacing">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Explore Nagpur</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Browse startups by sector
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {SECTORS.filter((s) => s.slug !== "other").map((sector) => (
              <Link
                key={sector.slug}
                href={`/startups/${sector.slug}`}
                className="badge-sector text-sm py-2 px-4"
              >
                {sector.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 4: Hiring Now ═══════════════ */}
      <section className="section-spacing bg-muted/30 border-y">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Hiring Now
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Companies actively hiring in Nagpur
              </p>
            </div>
            <Link
              href="/hiring"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all hiring companies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hiringCompanies.map((company) => (
              <CompanyCard key={company.slug} {...company} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/hiring"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              View all hiring companies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 5: Latest Jobs ═══════════════ */}
      <section className="section-spacing">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Latest Jobs</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fresh opportunities from Nagpur startups and tech companies
              </p>
            </div>
            <Link
              href="/jobs"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Explore all jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestJobs.map((job) => (
              <JobCard key={job.slug} {...job} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              Explore all jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 6: Interactive Ecosystem Map ═══════════════ */}
      <section className="section-spacing bg-background">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                <MapPin className="h-3 w-3" /> Live Ecosystem Geography
              </div>
              <h2 className="text-2xl font-bold">Interactive Startup Map</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore technology companies across Nagpur&apos;s primary innovation hubs: MIHAN SEZ, IT Park, Dharampeth, Sadar & Civil Lines.
              </p>
            </div>
            <Link
              href="/startups"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Full directory list <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <StartupMap />
        </div>
      </section>

      {/* ═══════════════ Section 7: Recently Added ═══════════════ */}
      <section className="section-spacing bg-muted/30 border-y">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Recently Added
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Newest companies on the map
              </p>
            </div>
            <Link
              href="/startups"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all startups
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentCompanies.map((company) => (
              <CompanyCard key={company.slug} {...company} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 8: Upcoming Events ═══════════════ */}
      <section className="section-spacing">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tech events, meetups and hackathons in Nagpur
              </p>
            </div>
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 9: Nagpur Tech Ecosystem ═══════════════ */}
      <section className="section-spacing bg-muted/30 border-y">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">
              Nagpur&apos;s Tech Ecosystem
            </h2>
            <div className="prose prose-sm text-muted-foreground max-w-none space-y-3">
              <p>
                Nagpur&apos;s startup and technology ecosystem is growing rapidly across software, SaaS, AI, manufacturing, logistics, healthcare, education and consumer businesses. As the third-largest city in Maharashtra and the geographic center of India, Nagpur offers unique advantages for technology companies including a growing talent pool, lower operating costs compared to Pune, Mumbai and Bangalore, and improving digital infrastructure.
              </p>
              <p>
                The MIHAN (Multi-modal International Cargo Hub and Airport at Nagpur) Special Economic Zone has attracted major IT companies including TCS, Infosys, HCLTech, Tech Mahindra and Hexaware, while homegrown companies like InfoCepts, Persistent Systems, and Excellon Software have built global businesses from the city.
              </p>
              <p>
                A new wave of startups is emerging in AI, edtech, SaaS and digital services, supported by institutions like IIM Nagpur (through its InFED incubator), VNIT&apos;s Centre for Innovation, and the Google AI Centre of Excellence at IIIT Nagpur. The city&apos;s startup ecosystem is increasingly active with regular meetups, hackathons, and networking events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Section 10: Add to the Map ═══════════════ */}
      <section className="section-spacing">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-2">
              Know a Nagpur startup that isn&apos;t here?
            </h2>
            <p className="text-muted-foreground mb-6">
              Help us build the most complete map of Nagpur&apos;s technology ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Startup
              </Link>
              <Link
                href="/submit/job"
                className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent w-full sm:w-auto"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Post a Job
              </Link>
              <Link
                href="/submit/event"
                className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent w-full sm:w-auto"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add Event
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
