import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getAllCompanies, getCompaniesForCity } from "@/lib/data";
import { getCompanyBySlug } from "@/lib/queries/companies";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nagpurCompanies = getCompaniesForCity("nagpur");
  const foundNagpur = nagpurCompanies.find((c) => c.slug === slug);
  if (foundNagpur) {
    return {
      title: `${foundNagpur.name} — Startup & Tech Company in Nagpur`,
      alternates: { canonical: `/nagpur/company/${slug}` },
      robots: { index: false, follow: true },
    };
  }
  const indoreCompanies = getCompaniesForCity("indore");
  const foundIndore = indoreCompanies.find((c) => c.slug === slug);
  if (foundIndore) {
    return {
      title: `${foundIndore.name} — Startup & Tech Company in Indore`,
      alternates: { canonical: `/indore/company/${slug}` },
      robots: { index: false, follow: true },
    };
  }
  return { title: "Company Redirect", robots: { index: false, follow: true } };
}

export default async function LegacyCompanyRedirectPage({ params }: Props) {
  const { slug } = await params;

  // 1. Check Nagpur static data first (most common legacy route)
  const nagpurCompanies = getCompaniesForCity("nagpur");
  if (nagpurCompanies.some((c) => c.slug === slug)) {
    redirect(`/nagpur/company/${slug}`);
  }

  // 2. Check Indore static data
  const indoreCompanies = getCompaniesForCity("indore");
  if (indoreCompanies.some((c) => c.slug === slug)) {
    redirect(`/indore/company/${slug}`);
  }

  // 3. Fallback to Database lookup if not found in static definitions
  const dbCompany = await getCompanyBySlug(slug);
  if (dbCompany) {
    const citySlug = dbCompany.cityId === 3 ? "indore" : "nagpur";
    redirect(`/${citySlug}/company/${slug}`);
  }

  notFound();
}
