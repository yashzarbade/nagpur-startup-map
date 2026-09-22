import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | Nagpur Startup Map",
  description: "Privacy policy and data protection terms for Nagpur Startup Map.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="my-8 space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: September 2026</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground text-sm leading-relaxed">
        <p>
          Welcome to Nagpur Startup Map. We are committed to protecting your privacy and ensuring transparency about how we collect and use information.
        </p>

        <h2 className="text-lg font-bold text-foreground pt-4">1. Information We Collect</h2>
        <p>
          We collect information submitted voluntarily by users, including company details, job postings, founder profiles, and event listings. For claims and verification, we may ask for contact email addresses to verify authenticity.
        </p>

        <h2 className="text-lg font-bold text-foreground pt-4">2. How We Use Information</h2>
        <p>
          Information submitted publicly is displayed on our directory and map to promote Nagpur&apos;s startup and technology ecosystem. Contact emails provided for moderation are never sold or rented to third parties.
        </p>

        <h2 className="text-lg font-bold text-foreground pt-4">3. Data Removal & Updates</h2>
        <p>
          If you are an authorized representative of a listed company or founder and wish to update or remove your listing, please use our contact page or claim form, and we will process your request promptly.
        </p>
      </div>
    </div>
  );
}
