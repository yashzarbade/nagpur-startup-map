import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service | Nagpur Startup Map",
  description: "Terms of service and directory submission guidelines for Nagpur Startup Map.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <div className="my-8 space-y-2">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: September 2026</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground text-sm leading-relaxed">
        <p>
          By accessing or using Nagpur Startup Map, you agree to comply with and be bound by these terms.
        </p>

        <h2 className="text-lg font-bold text-foreground pt-4">1. Directory Submissions</h2>
        <p>
          Users submitting companies, job openings, events, or founder profiles agree to provide truthful and accurate information. We reserve the right to review, edit, reject, or remove any submission that violates community guidelines, contains misleading claims, or lacks relevance to the Nagpur tech ecosystem.
        </p>

        <h2 className="text-lg font-bold text-foreground pt-4">2. Intellectual Property</h2>
        <p>
          All company logos, trademarks, and brand assets displayed on the platform belong to their respective owners. Nagpur Startup Map uses these marks solely for identification and directory categorization purposes under nominative fair use.
        </p>

        <h2 className="text-lg font-bold text-foreground pt-4">3. Disclaimer</h2>
        <p>
          While we verify listings to the best of our ability, Nagpur Startup Map does not guarantee the financial viability, legal standing, or employment terms of any listed company. Job seekers should perform their own due diligence before accepting employment.
        </p>
      </div>
    </div>
  );
}
