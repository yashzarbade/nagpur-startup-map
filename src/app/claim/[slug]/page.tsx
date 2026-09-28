import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getAllCompanies, getCompanyBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: "Company Not Found" };
  const citySlug = company.cityId === 3 || company.locationName.includes("Indore") ? "indore" : "nagpur";

  return {
    title: `Claim ${company.name}`,
    alternates: { canonical: `/${citySlug}/claim/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyClaimRedirectPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) {
    notFound();
  }

  const citySlug = company.cityId === 3 || company.locationName.includes("Indore") ? "indore" : "nagpur";
  redirect(`/${citySlug}/claim/${slug}`);
}
