import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { WalkinForm } from "./walkin-form";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Submit a Walk-in Interview Drive — Central India Tech",
  description:
    "Post a verified walk-in interview drive or recruitment event in Nagpur, Indore, or Bhopal. Reach local tech talent directly.",
  alternates: {
    canonical: `${SITE.url}/submit/walkin`,
  },
};

type Props = {
  searchParams: Promise<{ city?: string }>;
};

export default async function SubmitWalkinPage({ searchParams }: Props) {
  const { city } = await searchParams;

  return (
    <div className="container-page py-10 sm:py-12 max-w-3xl">
      <Link
        href="/walkins"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Walk-in Drives
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Community & Recruiter Submission</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Post a Walk-in Drive
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Submit details for an upcoming in-person walk-in interview, mega recruitment drive, or off-campus fresher hiring event across Nagpur, Indore, or Bhopal. Submissions are reviewed by our team before publishing.
        </p>
      </div>

      <WalkinForm defaultCity={city} />
    </div>
  );
}
