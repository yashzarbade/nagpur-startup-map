import type { Metadata } from "next";
import Link from "next/link";
import { Users, Link2, Globe } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { founderUrl, companyUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Startup Founders in Nagpur",
  description:
    "Discover founders and leaders of startups and technology companies in Nagpur. Connect with the people building Nagpur's tech ecosystem.",
  alternates: { canonical: "/founders" },
  openGraph: {
    title: "Startup Founders in Nagpur | Nagpur Startup Map",
    description: "Discover founders of startups and technology companies in Nagpur.",
    url: `${SITE.url}/founders`,
  },
};

import { getAllFounders } from "@/lib/data";

export default function FoundersPage() {
  const founders = getAllFounders();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Founders", href: "/founders" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Startup Founders in Nagpur</h1>
        <p className="text-muted-foreground mt-2">
          Meet the people building Nagpur&apos;s technology ecosystem
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {founders.map((founder) => (
          <Link
            key={founder.slug}
            href={founderUrl(founder.slug)}
            className="group flex items-start gap-4 rounded-xl border bg-card p-5 card-hover"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {founder.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {founder.name}
              </h3>
              <p className="text-xs text-muted-foreground">{founder.role}</p>
              {founder.companyName && (
                <p className="text-xs text-primary mt-0.5">
                  {founder.companyName}
                </p>
              )}
              {founder.bio && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {founder.bio}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {founder.linkedinUrl && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Link2 className="h-3 w-3" /> LinkedIn
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
