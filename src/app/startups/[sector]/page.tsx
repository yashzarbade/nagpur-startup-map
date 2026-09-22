import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ArrowRight, Sparkles, Filter } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompanyCard } from "@/components/company-card";
import { EmptyState } from "@/components/empty-state";
import { SECTORS, SITE } from "@/lib/constants";
import { getCompaniesBySector } from "@/lib/data";

type Props = { params: Promise<{ sector: string }> };

export async function generateStaticParams() {
  return SECTORS.map((s) => ({
    sector: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector: sectorSlug } = await params;
  const sectorObj = SECTORS.find((s) => s.slug === sectorSlug);
  const sectorName = sectorObj ? sectorObj.label : sectorSlug.replace(/-/g, " ");

  return {
    title: `${sectorName} Startups & Tech Companies in Nagpur`,
    description: `Discover verified ${sectorName} startups, tech companies, and products building in Nagpur, Maharashtra.`,
    alternates: { canonical: `/startups/${sectorSlug}` },
    openGraph: {
      title: `${sectorName} Startups in Nagpur | ${SITE.name}`,
      description: `Explore top ${sectorName} companies in Nagpur.`,
      url: `${SITE.url}/startups/${sectorSlug}`,
    },
  };
}

export default async function SectorPage({ params }: Props) {
  const { sector: sectorSlug } = await params;
  const sectorObj = SECTORS.find((s) => s.slug === sectorSlug);
  const sectorName = sectorObj ? sectorObj.label : sectorSlug.replace(/-/g, " ");

  const companies = getCompaniesBySector(sectorSlug);

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Startups", href: "/startups" },
          { label: `${sectorName} Companies` },
        ]}
      />

      {/* Sector Header */}
      <div className="my-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Sector Spotlight
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {sectorName} Startups in Nagpur
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Discover {companies.length} verified {sectorName.toLowerCase()} companies, innovative products, and development teams in Nagpur.
        </p>
      </div>

      {/* Other Sector Quick Navigation */}
      <div className="flex flex-wrap gap-2 pb-6 border-b mb-6">
        {SECTORS.map((s) => (
          <Link
            key={s.slug}
            href={`/startups/${s.slug}`}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              s.slug === sectorSlug
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Companies Grid */}
      {companies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.slug} {...company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${sectorName} startups listed yet`}
          description={`Are you building a ${sectorName.toLowerCase()} startup in Nagpur? Add your company to our verified ecosystem directory.`}
          actionLabel="Add Your Startup"
          actionHref="/submit"
        />
      )}

      {/* Bottom CTA */}
      <div className="mt-12 p-8 rounded-2xl border bg-muted/30 text-center max-w-xl mx-auto space-y-3">
        <Building2 className="h-8 w-8 text-primary mx-auto" />
        <h3 className="text-lg font-bold">Building in {sectorName}?</h3>
        <p className="text-xs text-muted-foreground">
          Get your company discovered by Nagpur job seekers, investors, clients, and community builders. Listing is 100% free.
        </p>
        <div>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-sm"
          >
            Submit Company Profile <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
