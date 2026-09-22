import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Briefcase, MapPin, Users, ArrowRight, Building2 } from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Companies Hiring in Nagpur",
  description:
    "Discover startups and technology companies currently hiring in Nagpur. Find open positions in engineering, AI, design, marketing, sales and more.",
  alternates: { canonical: "/hiring" },
  openGraph: {
    title: "Companies Hiring in Nagpur | Nagpur Startup Map",
    description: "Discover companies currently hiring in Nagpur.",
    url: `${SITE.url}/hiring`,
  },
};

import { getHiringCompanies } from "@/lib/data";

export default function HiringPage() {
  const companies = getHiringCompanies();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Hiring", href: "/hiring" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-emerald-500" />
          Companies Hiring in Nagpur
        </h1>
        <p className="text-muted-foreground mt-2">
          {companies.length} companies actively hiring across Nagpur&apos;s startup and tech ecosystem
        </p>
      </div>

      {/* Quick department filters */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">
          Departments:
        </span>
        {["Engineering", "AI/ML", "Design", "Product", "Sales", "Marketing", "Internships"].map((dept) => (
          <span
            key={dept}
            className="badge-sector cursor-pointer"
          >
            {dept}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.slug} {...company} />
        ))}
      </div>

      {/* Post a job CTA */}
      <div className="mt-12 rounded-xl border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold mb-1">Hiring for your company?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Post your open positions to reach tech talent in Nagpur.
        </p>
        <Link
          href="/submit/job"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Briefcase className="h-4 w-4" />
          Post a Job — Free
        </Link>
      </div>
    </div>
  );
}
