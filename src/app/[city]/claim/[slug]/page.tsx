import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { getCityBySlug, getAllCities } from "@/lib/cities";
import { getCompanyBySlug } from "@/lib/queries/companies";
import { getCompaniesForCity } from "@/lib/data";
import { ClaimForm } from "@/components/claim/claim-form";

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) return { title: "City Not Found" };

  let company = await getCompanyBySlug(slug, city.id);
  if (!company) {
    const fallbackList = getCompaniesForCity(citySlug);
    company = fallbackList.find((c) => c.slug === slug) as any;
  }
  if (!company) return { title: "Company Not Found" };

  const cityName = city.name;
  const canonicalUrl = `${SITE.url}/${city.slug}/claim/${slug}`;

  return {
    title: `Claim ${company.name} | ${SITE.name}`,
    description: `Verify ownership of ${company.name} in ${cityName} to edit company details, post job openings, and access verified company privileges.`,
    alternates: { canonical: canonicalUrl },
  };
}

export default async function CityClaimPage({ params }: Props) {
  const { city: citySlug, slug } = await params;
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  let company = await getCompanyBySlug(slug, city.id);
  if (!company) {
    const fallbackList = getCompaniesForCity(citySlug);
    company = fallbackList.find((c) => c.slug === slug) as any;
    if (!company) notFound();
  }

  const cityName = city.name;

  return (
    <div className="container-page py-8 max-w-2xl mx-auto">
      <Breadcrumbs
        items={[
          { label: `${cityName} Hub`, href: `/${city.slug}` },
          { label: "Startups", href: `/${city.slug}/startups` },
          { label: company?.name || slug, href: `/${city.slug}/company/${slug}` },
          { label: "Claim Listing" },
        ]}
      />

      <div className="my-6">
        <Link
          href={`/${city.slug}/company/${slug}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to company profile
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            Official Claim Flow
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Claim {company?.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify that you are an authorized founder or team member of {company?.name} to manage this official profile on {SITE.name}.
        </p>
      </div>

      <ClaimForm
        companyId={company.id}
        companyName={company.name}
        companySlug={company.slug}
        citySlug={city.slug}
      />
    </div>
  );
}
