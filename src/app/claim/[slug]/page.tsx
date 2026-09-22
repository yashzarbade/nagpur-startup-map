import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ShieldCheck, CheckCircle2, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { getAllCompanies, getCompanyBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCompanies().map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: "Company Not Found" };

  return {
    title: `Claim ${company.name} on Nagpur Startup Map`,
    description: `Verify ownership of ${company.name} to edit company details, post job openings, and access verified founder privileges.`,
    alternates: { canonical: `/claim/${slug}` },
  };
}

export default async function ClaimCompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="container-page py-8 max-w-2xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Startups", href: "/startups" },
          { label: company.name, href: `/company/${company.slug}` },
          { label: "Claim Listing" },
        ]}
      />

      <div className="my-6">
        <Link
          href={`/company/${company.slug}`}
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
          Claim {company.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Are you a founder, executive, or HR representative of {company.name}? Claim this page to take control of your profile.
        </p>
      </div>

      {/* Claim Benefits */}
      <div className="p-5 rounded-2xl border bg-muted/20 mb-8 space-y-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> What you unlock when claimed:
        </h2>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>Update logo, description, social links, and physical address</li>
          <li>Directly post and manage active job listings & internships</li>
          <li>Add and verify official company founders</li>
          <li>Official Verified Company badge on the map</li>
        </ul>
      </div>

      {/* Claim Form */}
      <form className="space-y-4 bg-card p-6 sm:p-8 rounded-2xl border shadow-sm">
        <div>
          <label className="text-xs font-semibold block mb-1.5">Your Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Priya Kulkarni"
            className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1.5">Your Role / Designation *</label>
          <input
            type="text"
            required
            placeholder="e.g. Co-Founder, HR Director, Head of Marketing"
            className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1.5">Official Company Work Email *</label>
          <input
            type="email"
            required
            placeholder={`you@${company.websiteUrl ? company.websiteUrl.replace(/https?:\/\/(www\.)?/, "").replace(/\/.*$/, "") : "company.com"}`}
            className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            We will send an instant verification link to this company domain email.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1.5">LinkedIn Profile or Proof of Representation</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
          >
            Submit Claim Verification <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
