import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getJobBySlugWithStatus } from "@/lib/queries/jobs";
import { getAllJobs } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlugWithStatus(slug);
  if (!job) return { title: "Job Not Found" };
  const citySlug =
    (job as any).cityId === 3
      ? "indore"
      : (job as any).cityId === 6
      ? "bhopal"
      : "nagpur";

  return {
    title: `${job.title} at ${job.companyName}`,
    alternates: { canonical: `/${citySlug}/job/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyJobRedirectPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlugWithStatus(slug);
  if (!job) {
    const all = getAllJobs();
    const found = all.find((j) => j.slug === slug);
    if (!found) notFound();
    const citySlug =
      found.location?.toLowerCase().includes("indore") || (found as any).cityId === 3
        ? "indore"
        : found.location?.toLowerCase().includes("bhopal") || (found as any).cityId === 6
        ? "bhopal"
        : "nagpur";
    redirect(`/${citySlug}/job/${slug}`);
  }
  const citySlug =
    (job as any).cityId === 3
      ? "indore"
      : (job as any).cityId === 6
      ? "bhopal"
      : "nagpur";
  redirect(`/${citySlug}/job/${slug}`);
}
