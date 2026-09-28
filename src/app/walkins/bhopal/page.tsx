import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search, MapPin } from "lucide-react";
import { getWalkins } from "@/lib/queries/walkins";
import { WalkinCard } from "@/components/walkin-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Walk-in Interview Drives in Bhopal — Tech & IT Jobs Bhopal",
  description:
    "Explore upcoming walk-in interview drives, IT recruitment events, and off-campus fresher hiring in Bhopal across MP Nagar, Mandideep, and Arera Colony.",
  alternates: {
    canonical: `${SITE.url}/walkins/bhopal`,
  },
  openGraph: {
    title: "Walk-in Interview Drives in Bhopal — Central India Tech",
    description:
      "Find genuine upcoming walk-in interview drives and direct hiring events in Bhopal, MP.",
    url: `${SITE.url}/walkins/bhopal`,
  },
};

type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

export default async function BhopalWalkinsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search;

  const { walkins, total, totalPages } = await getWalkins({
    search,
    citySlug: "bhopal",
    freshness: "upcoming",
    page,
  });

  return (
    <div className="container-page py-10 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-8 border-b">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>Bhopal, Madhya Pradesh</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Bhopal Walk-in Interview Drives
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Upcoming recruitment drives, fresher walk-ins, and direct interviews across Bhopal and MP Nagar.
          </p>
        </div>

        <Link
          href="/submit/walkin?city=bhopal"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Submit a Bhopal Walk-In
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/walkins" className="text-muted-foreground hover:text-foreground">
            All Cities
          </Link>
          <span>•</span>
          <Link href="/walkins/nagpur" className="text-muted-foreground hover:text-foreground">
            Nagpur
          </Link>
          <span>•</span>
          <Link href="/walkins/indore" className="text-muted-foreground hover:text-foreground">
            Indore
          </Link>
          <span>•</span>
          <span className="font-semibold text-primary">Bhopal</span>
        </div>

        <form method="GET" action="/walkins/bhopal" className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
            placeholder="Search Bhopal drives..."
            className="w-full rounded-lg border bg-background pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </form>
      </div>

      <div className="mt-8">
        {walkins.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {walkins.map((walkin) => (
              <WalkinCard key={walkin.id} walkin={walkin} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming walk-in drives in Bhopal"
            description="We haven't discovered any upcoming walk-in drives in Bhopal right now. Check back soon or submit an announcement."
            actionLabel="Post a Bhopal Walk-In"
            actionHref="/submit/walkin?city=bhopal"
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} baseUrl="/walkins/bhopal" />
        </div>
      )}
    </div>
  );
}
