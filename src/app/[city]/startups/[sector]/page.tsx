import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug, getAllCities } from "@/lib/cities";
import { SECTORS, SITE } from "@/lib/constants";
import { CityStartupsView } from "@/components/city/city-startups-view";
import { CityComingSoon } from "@/components/city/city-coming-soon";

type Props = {
  params: Promise<{ city: string; sector: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, sector: sectorSlug } = await params;
  const city = await getCityBySlug(citySlug);
  const sector = SECTORS.find((s) => s.slug === sectorSlug);
  if (!city || !sector) return { title: "Sector Not Found" };

  const title = `${sector.label} Companies & Startups in ${city.name} | ${city.name} Startup Map`;
  const description = `Explore top ${sector.label} companies, startups, and tech products in ${city.name}, ${city.state}. Browse verified companies and open job roles.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.url}/${city.slug}/startups/${sector.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/${city.slug}/startups/${sector.slug}`,
    },
  };
}

export default async function CitySectorStartupsPage({ params, searchParams }: Props) {
  const { city: citySlug, sector: sectorSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  if (!city.isPublished) {
    return <CityComingSoon city={city} />;
  }

  const page = Number(resolvedSearchParams.page) || 1;

  return <CityStartupsView city={city} sectorSlug={sectorSlug} page={page} />;
}
