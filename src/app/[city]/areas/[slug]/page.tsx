import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug, getCityAreas } from "@/lib/cities";
import { SITE } from "@/lib/constants";
import { CityStartupsView } from "@/components/city/city-startups-view";
import { CityComingSoon } from "@/components/city/city-coming-soon";

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, slug: areaSlug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };

  const areaName = areaSlug.replace(/-/g, " ");
  const title = `Startups & Tech Companies in ${areaName}, ${city.name} | ${city.name} Startup Map`;
  const description = `Browse verified technology companies, IT offices, and startups located in ${areaName}, ${city.name}, ${city.state}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.url}/${city.slug}/areas/${areaSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/${city.slug}/areas/${areaSlug}`,
    },
  };
}

export default async function CityAreaPage({ params }: Props) {
  const { city: citySlug, slug: areaSlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  if (!city.isPublished) {
    return <CityComingSoon city={city} />;
  }

  return <CityStartupsView city={city} areaSlug={areaSlug} />;
}
