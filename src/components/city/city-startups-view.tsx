import Link from "next/link";
import { Building2, MapPin, ArrowRight, Plus, Search } from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Pagination } from "@/components/pagination";
import { SECTORS, ITEMS_PER_PAGE } from "@/lib/constants";
import { StartupMap } from "@/components/startup-map";
import { getCompanies, getCompaniesBySector, getCompaniesByArea, getCityMapCompanies } from "@/lib/queries/companies";
import { getCityAreas } from "@/lib/cities";
import type { City } from "@/types";

interface CityStartupsViewProps {
  city: City;
  sectorSlug?: string;
  areaSlug?: string;
  page?: number;
  search?: string;
  sort?: string;
  companyType?: string;
}

export async function CityStartupsView({
  city,
  sectorSlug,
  areaSlug,
  page = 1,
  search,
  sort,
  companyType,
}: CityStartupsViewProps) {
  const cityId = city.id;
  const cityName = city.name;
  const citySlug = city.slug;
  const cityAreas = getCityAreas(citySlug);

  const currentPage = Math.max(1, page);

  const [result, mapCompanies] = await Promise.all([
    sectorSlug
      ? getCompaniesBySector(sectorSlug, currentPage, cityId)
      : areaSlug
      ? getCompaniesByArea(areaSlug, currentPage, cityId)
      : getCompanies({ cityId, page: currentPage, search, sort: sort as any }),
    getCityMapCompanies(cityId, citySlug),
  ]);

  const { companies: companyList, total, totalPages } = result;

  const lat = city.latitude ? parseFloat(city.latitude) : 21.1458;
  const lng = city.longitude ? parseFloat(city.longitude) : 79.0882;

  const currentSector = sectorSlug
    ? SECTORS.find((s) => s.slug === sectorSlug)
    : null;

  const breadcrumbs = [
    { label: cityName, href: `/${citySlug}` },
    { label: "Companies & Startups", href: `/${citySlug}/startups` },
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

  // Calculate showing range
  const startItem = total > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

  // Build base URL for pagination
  const paginationBaseUrl = sectorSlug
    ? `/${citySlug}/startups/${sectorSlug}`
    : areaSlug
    ? `/${citySlug}/areas/${areaSlug}`
    : `/${citySlug}/startups`;

  // Build searchParams for pagination (preserving filters)
  const paginationSearchParams: Record<string, string | undefined> = {};
  if (search) paginationSearchParams.search = search;
  if (sort && sort !== "newest") paginationSearchParams.sort = sort;
  if (companyType) paginationSearchParams.type = companyType;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {currentSector
            ? `${currentSector.label} Companies & Startups in ${cityName}`
            : areaSlug
            ? `Companies & Startups in ${areaSlug.replace(/-/g, " ")}, ${cityName}`
            : `Companies & Startups in ${cityName}`}
        </h1>
        <p className="text-muted-foreground mt-2">
          {total > 0
            ? `Discover ${total} verified companies and startups across ${cityName}'s growing ecosystem.`
            : `Exploring verified companies and startups across ${cityName}.`}
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

      {/* Interactive Map — only show on first page to keep pagination fast */}
      {currentPage === 1 && (
        <div className="mb-10">
          <StartupMap
            cityName={cityName}
            citySlug={citySlug}
            center={[lng, lat]}
            zoom={11}
            companiesList={mapCompanies}
          />
        </div>
      )}

      {/* Company grid header with showing range */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {currentSector
              ? `${currentSector.label} Companies (${total})`
              : `All Companies in ${cityName} (${total})`}
          </h2>
          {total > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Showing {startItem}–{endItem} of {total} companies
            </p>
          )}
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add a Company</span>
        </Link>
      </div>

      {/* Company grid */}
      {companyList.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companyList.map((company: any) => (
              <CompanyCard key={company.slug} {...company} />
            ))}
          </div>

          {/* Server-rendered pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={paginationBaseUrl}
                searchParams={paginationSearchParams}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={`No companies found in ${cityName}${currentSector ? ` in ${currentSector.label}` : ""}`}
          description={`We don't have verified companies listed for this filter in ${cityName} yet. Help us grow the map!`}
          actionLabel={`View all ${cityName} companies`}
          actionHref={`/${citySlug}/startups`}
          secondaryLabel={`Add a company in ${cityName}`}
          secondaryHref="/submit"
        />
      )}
    </div>
  );
}
