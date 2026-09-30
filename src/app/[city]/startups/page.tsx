import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug, getAllCities, getCityMetadata } from "@/lib/cities";
import { CityStartupsView } from "@/components/city/city-startups-view";
import { CityComingSoon } from "@/components/city/city-coming-soon";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const cities = await getAllCities();
  return cities.map((c) => ({
    city: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };
  return getCityMetadata(city, "startups");
}

export default async function CityStartupsPage({ params, searchParams }: Props) {
  const { city: citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  if (!city.isPublished) {
    return <CityComingSoon city={city} />;
  }

  const page = Number(resolvedSearchParams.page) || 1;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;
  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : undefined;
  const companyType = typeof resolvedSearchParams.type === "string" ? resolvedSearchParams.type : undefined;

  return (
    <CityStartupsView
      city={city}
      page={page}
      search={search}
      sort={sort}
      companyType={companyType}
    />
  );
}
