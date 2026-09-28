import Link from "next/link";
import { Building2, MapPin, ArrowRight, Plus } from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SECTORS } from "@/lib/constants";
import { StartupMap } from "@/components/startup-map";
import { getCompanies, getCompaniesBySector, getCompaniesByArea, getCityMapCompanies } from "@/lib/queries/companies";
import { getCityAreas } from "@/lib/cities";
import type { City } from "@/types";

interface CityStartupsViewProps {
  city: City;
  sectorSlug?: string;
  areaSlug?: string;
}

export async function CityStartupsView({
  city,
  sectorSlug,
  areaSlug,
}: CityStartupsViewProps) {
  const cityId = city.id;
  const cityName = city.name;
  const citySlug = city.slug;
  const cityAreas = getCityAreas(citySlug);

  const [result, mapCompanies] = await Promise.all([
    sectorSlug
      ? getCompaniesBySector(sectorSlug, 1, cityId)
      : areaSlug
      ? getCompaniesByArea(areaSlug, 1, cityId)
      : getCompanies({ cityId, page: 1 }),
    getCityMapCompanies(cityId, citySlug),
  ]);

  const { companies: companyList, total } = result;

  const lat = city.latitude ? parseFloat(city.latitude) : 21.1458;
  const lng = city.longitude ? parseFloat(city.longitude) : 79.0882;

  const currentSector = sectorSlug
    ? SECTORS.find((s) => s.slug === sectorSlug)
    : null;

  const breadcrumbs = [
    { label: cityName, href: `/${citySlug}` },
    { label: "Startups", href: `/${citySlug}/startups` },
  ];
  if (currentSector) {
    breadcrumbs.push({
      label: currentSector.label,
      href: `/${citySlug}/startups/${sectorSlug}`,
    });
  } else if (areaSlug) {
    breadcrumbs.push({
      label: areaSlug.replace(/-/g, " "),
      href: `/${citySlug}/areas/${areaSlug}`,
    });
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {currentSector
            ? `${currentSector.label} Startups in ${cityName}`
            : areaSlug
            ? `Startups in ${areaSlug.replace(/-/g, " ")}, ${cityName}`
            : `Startups & Tech Companies in ${cityName}`}
        </h1>
        <p className="text-muted-foreground mt-2">
          {total > 0
            ? `Discover ${total} verified startups and technology companies across ${cityName}'s growing ecosystem.`
            : `Exploring verified startups and technology companies across ${cityName}.`}
        </p>
      </div>

      {/* Sector filter bar */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
          Browse by sector:
        </span>
        <Link
          href={`/${citySlug}/startups`}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !sectorSlug
              ? "bg-primary text-primary-foreground font-semibold"
              : "border bg-card hover:bg-accent text-foreground"
          }`}
        >
          All
        </Link>
        {SECTORS.filter((s) => s.slug !== "other")
          .slice(0, 10)
          .map((sector) => (
            <Link
              key={sector.slug}
              href={`/${citySlug}/startups/${sector.slug}`}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sectorSlug === sector.slug
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border bg-card hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {sector.label}
            </Link>
          ))}
      </div>

      {/* Area quick links if city has areas */}
      {cityAreas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
            {cityName} Areas:
          </span>
          {cityAreas.slice(0, 8).map((area) => (
            <Link
              key={area.slug}
              href={`/${citySlug}/areas/${area.slug}`}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                areaSlug === area.slug
                  ? "bg-accent text-foreground font-semibold border-primary/50"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <MapPin className="h-3 w-3" />
              {area.label}
            </Link>
          ))}
        </div>
      )}

      {/* Interactive Map */}
      <div className="mb-10">
        <StartupMap
          cityName={cityName}
          citySlug={citySlug}
          center={[lng, lat]}
          zoom={11}
          companiesList={mapCompanies}
        />
      </div>

      {/* Company grid header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {currentSector
            ? `${currentSector.label} Companies (${total})`
            : `All Companies in ${cityName} (${total})`}
        </h2>
        <Link
          href="/submit"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add a Startup</span>
        </Link>
      </div>

      {/* Company grid */}
      {companyList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companyList.map((company: any) => (
            <CompanyCard key={company.slug} {...company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No startups found in ${cityName}${currentSector ? ` in ${currentSector.label}` : ""}`}
          description={`We don't have verified startups listed for this filter in ${cityName} yet. Help us grow the map!`}
          actionLabel={`View all ${cityName} startups`}
          actionHref={`/${citySlug}/startups`}
          secondaryLabel={`Add a startup in ${cityName}`}
          secondaryHref="/submit"
        />
      )}
    </div>
  );
}
