import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug, getAllCities, getCityMetadata } from "@/lib/cities";
import { CityHiringView } from "@/components/city/city-hiring-view";
import { CityComingSoon } from "@/components/city/city-coming-soon";

type Props = {
  params: Promise<{ city: string }>;
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
  return getCityMetadata(city, "hiring");
}

export default async function CityHiringPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  if (!city.isPublished) {
    return <CityComingSoon city={city} />;
  }

  return <CityHiringView city={city} />;
}
