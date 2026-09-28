import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { founderUrl, companyUrl } from "@/lib/utils";
import { getFounders } from "@/lib/queries/founders";
import { getAllFounders } from "@/lib/data";
import type { City } from "@/types";

interface CityFoundersViewProps {
  city: City;
}

export async function CityFoundersView({ city }: CityFoundersViewProps) {
  const cityId = city.id;
  const cityName = city.name;
  const citySlug = city.slug;

  let foundersList: any[] = [];
  try {
    foundersList = await getFounders(cityId);
  } catch (err) {
    console.error("Error loading founders:", err);
  }

  // Fallback only for Nagpur
  if (foundersList.length === 0 && citySlug === "nagpur") {
    foundersList = getAllFounders();
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: cityName, href: `/${citySlug}` },
          { label: "Founders", href: `/${citySlug}/founders` },
        ]}
      />

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Startup Founders in {cityName}
          </h1>
          <p className="text-muted-foreground mt-2">
            Meet the entrepreneurs, innovators, and leaders building {cityName}&apos;s tech ecosystem
          </p>
        </div>
        <Link
          href="/submit/founder"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add a Founder</span>
        </Link>
      </div>

      {foundersList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foundersList.map((founder) => (
            <Link
              key={founder.slug}
              href={founderUrl(founder.slug)}
              className="group flex items-start gap-4 rounded-xl border bg-card p-5 card-hover"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-foreground">
                {founder.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {founder.name}
                </h3>
                <p className="text-xs text-muted-foreground">{founder.role}</p>
                {founder.companyName && (
                  <p className="text-xs text-primary mt-0.5">
                    {founder.companyName}
                  </p>
                )}
                {founder.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {founder.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No founders listed for ${cityName} yet`}
          description={`Are you building a tech company in ${cityName}? Join our founder directory to connect with investors and peers.`}
          actionLabel="Submit Founder Profile"
          actionHref="/submit/founder"
          secondaryLabel={`Explore ${cityName} Startups`}
          secondaryHref={`/${citySlug}/startups`}
        />
      )}
    </div>
  );
}
