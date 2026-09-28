import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search, Calendar, MapPin, Sparkles } from "lucide-react";
import { getWalkins } from "@/lib/queries/walkins";
import { WalkinCard } from "@/components/walkin-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Walk-in Interview Drives in Central India — Nagpur, Indore, Bhopal",
  description:
    "Discover upcoming tech walk-in interviews, mega hiring drives, campus recruitment, and fresher off-campus opportunities in Nagpur, Indore, and Bhopal.",
  alternates: {
    canonical: `${SITE.url}/walkins`,
  },
  openGraph: {
    title: "Walk-in Interview Drives & Hiring Events — Central India Tech",
    description:
      "Find genuine upcoming walk-in interview drives in Nagpur, Indore, and Bhopal.",
    url: `${SITE.url}/walkins`,
  },
};

type Props = {
  searchParams: Promise<{
    search?: string;
    city?: string;
    freshness?: "upcoming" | "today" | "all";
    sort?: "upcoming" | "newest";
    page?: string;
  }>;
};

export default async function WalkinsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const citySlug = params.city;
  const freshness = params.freshness || "upcoming";
  const search = params.search;

  const { walkins, total, totalPages } = await getWalkins({
    search,
    citySlug,
    freshness,
    page,
  });

  const cityOptions = [
    { label: "All Central India", slug: "" },
    { label: "Nagpur", slug: "nagpur" },
    { label: "Indore", slug: "indore" },
    { label: "Bhopal", slug: "bhopal" },
  ];

  return (
    <div className="container-page py-10 sm:py-12">
      {/* ── Header & Action ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-8 border-b">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Direct Hiring & Interview Drives</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Walk-in Interview Drives
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Explore verified upcoming walk-in drives and direct interview opportunities across Nagpur, Indore, and Bhopal.
          </p>
        </div>

        <Link
          href="/submit/walkin"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Submit a Walk-In
        </Link>
      </div>

      {/* ── Filters Bar ── */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {cityOptions.map((opt) => {
            const isActive = (citySlug || "") === opt.slug;
            const queryParams = new URLSearchParams();
            if (opt.slug) queryParams.set("city", opt.slug);
            if (freshness !== "upcoming") queryParams.set("freshness", freshness);
            if (search) queryParams.set("search", search);
            const href = `/walkins${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

            return (
              <Link
                key={opt.slug}
                href={href}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

        {/* Search & Freshness */}
        <div className="flex items-center gap-3">
          <form method="GET" action="/walkins" className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {citySlug && <input type="hidden" name="city" value={citySlug} />}
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search title, skills, venue..."
              className="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </form>
        </div>
      </div>

      {/* ── Walk-in Listings Grid ── */}
      <div className="mt-8">
        {walkins.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {walkins.map((walkin) => (
              <WalkinCard key={walkin.id} walkin={walkin} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No walk-in drives found"
            description="We haven't discovered any upcoming walk-in interview drives matching your filters. Try selecting a different city or clearing your search."
            actionLabel="Post a Walk-In Drive"
            actionHref="/submit/walkin"
          />
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/walkins"
          />
        </div>
      )}

      {/* ── SEO Crawlable Hub Links ── */}
      <div className="mt-16 pt-8 border-t text-xs text-muted-foreground">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Explore City Walk-In Hubs
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/walkins/nagpur" className="hover:text-primary transition-colors">
            • Nagpur Walk-in Drives & Job Fairs
          </Link>
          <Link href="/walkins/indore" className="hover:text-primary transition-colors">
            • Indore Tech Walk-ins & Off-Campus Drives
          </Link>
          <Link href="/walkins/bhopal" className="hover:text-primary transition-colors">
            • Bhopal Walk-in Interviews & Recruitment Drives
          </Link>
        </div>
      </div>
    </div>
  );
}
