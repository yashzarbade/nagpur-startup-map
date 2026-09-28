import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Users,
  Building2,
  MapPin,
  ExternalLink,
  Link2,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { getAllFounders, getFounderBySlug, getCompanyBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllFounders().map((f) => ({
    slug: f.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const founder = getFounderBySlug(slug);
  if (!founder) return { title: "Founder Not Found" };

  return {
    title: `${founder.name} — ${founder.role} of ${founder.companyName} | ${founder.location || "Nagpur"}`,
    description: `Learn about ${founder.name}, ${founder.role} of ${founder.companyName} in ${founder.location || "Nagpur"}. Read bio, company information, and professional journey.`,
    alternates: { canonical: `/founder/${slug}` },
    openGraph: {
      title: `${founder.name} | ${SITE.name}`,
      description: founder.bio,
      url: `${SITE.url}/founder/${slug}`,
    },
  };
}

export default async function FounderDetailPage({ params }: Props) {
  const { slug } = await params;
  const founder = getFounderBySlug(slug);

  if (!founder) {
    notFound();
  }

  const company = getCompanyBySlug(founder.companySlug);

  // Schema.org Person JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.role,
    worksFor: {
      "@type": "Organization",
      name: founder.companyName,
      sameAs: company?.websiteUrl,
    },
    description: founder.bio,
    homeLocation: {
      "@type": "Place",
      name: founder.location,
    },
    sameAs: founder.linkedinUrl ? [founder.linkedinUrl] : [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { label: "Founders", href: "/founders" },
            { label: founder.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-3 mt-4">
          {/* Main Founder Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center border shrink-0 shadow-inner">
                  {founder.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{founder.name}</h1>
                  <p className="text-base text-muted-foreground mt-0.5">{founder.role}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Building2 className="h-3.5 w-3.5 text-primary" /> {founder.companyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {founder.location}
                    </span>
                  </div>
                </div>
              </div>

              {founder.linkedinUrl && (
                <div className="pt-3 border-t">
                  <a
                    href={founder.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-accent transition-colors"
                  >
                    <Link2 className="h-3.5 w-3.5" /> View on LinkedIn
                  </a>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-3">
              <h2 className="text-lg font-bold">Biography & Background</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {founder.bio}
              </p>
            </div>

            {/* Associated Company Card */}
            {company && (
              <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Company Founded</h2>
                  <Link
                    href={`/${(company as any).cityId === 3 ? "indore" : "nagpur"}/company/${company.slug}`}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    View company details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base">{company.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {company.sector}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {company.descriptionShort}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span>Location: {company.locationName}</span>
                    <span>•</span>
                    <span>Team: {company.teamSize}</span>
                    {company.hiring && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Hiring Now</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-3 text-sm">
              <h3 className="font-semibold text-sm">Quick Overview</h3>
              <div>
                <p className="text-xs text-muted-foreground">Current Venture</p>
                <p className="font-medium mt-0.5">{founder.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium mt-0.5">{founder.location}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-primary/5 text-center space-y-3">
              <Users className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-bold text-sm">Are you a Nagpur founder?</h3>
              <p className="text-xs text-muted-foreground">
                Get listed in Nagpur&apos;s public directory of startup founders and ecosystem leaders.
              </p>
              <Link
                href="/submit/founder"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create Founder Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
