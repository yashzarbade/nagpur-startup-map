import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getAllEvents } from "@/lib/data";
import { getEventBySlug } from "@/lib/queries/events";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  const citySlug = (event as any).cityId === 3 ? "indore" : "nagpur";

  return {
    title: `${event.title} — Tech Event`,
    alternates: { canonical: `/${citySlug}/event/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyEventRedirectPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    const all = getAllEvents();
    const found = all.find((e) => e.slug === slug);
    if (!found) notFound();
    const citySlug =
      found.location?.toLowerCase().includes("indore") || (found as any).cityId === 3
        ? "indore"
        : "nagpur";
    redirect(`/${citySlug}/event/${slug}`);
  }
  const citySlug = (event as any).cityId === 3 ? "indore" : "nagpur";
  redirect(`/${citySlug}/event/${slug}`);
}
