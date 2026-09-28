import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Briefcase,
  GraduationCap,
  IndianRupee,
} from "lucide-react";
import { getWalkinBySlug } from "@/lib/queries/walkins";
import { generateJobPostingSchema } from "@/lib/seo/job-posting";
import { SITE } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const walkin = await getWalkinBySlug(slug);

  if (!walkin) {
    return { title: "Walk-in Drive Not Found" };
  }

  const walkinDate = walkin.walkinDate
    ? new Date(walkin.walkinDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const title = `${walkin.title} — Walk-in Drive at ${walkin.companyName} (${walkin.cityName || "Central India"})`;
  const description = `Walk-in interview on ${walkinDate} for ${walkin.title} at ${walkin.companyName}, ${walkin.cityName}. Venue: ${walkin.walkinVenue || "Check announcement"}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.url}/walkins/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/walkins/${slug}`,
    },
  };
}

export default async function WalkinDetailPage({ params }: Props) {
  const { slug } = await params;
  const walkin = await getWalkinBySlug(slug);

  if (!walkin) {
    notFound();
  }

  const walkinDate = walkin.walkinDate ? new Date(walkin.walkinDate) : null;
  const isPast = walkinDate ? walkinDate.getTime() < Date.now() : false;
  const formattedDate = walkinDate
    ? walkinDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Announced in notice";

  // Generate Schema.org JobPosting (strictly suppressed if expired)
  const jobSchema = generateJobPostingSchema({
    title: walkin.title,
    description: walkin.description,
    postedAt: walkin.postedAt,
    employmentType: walkin.employmentType,
    remoteType: walkin.remoteType,
    companyName: walkin.companyName || "Employer",
    companyWebsite: walkin.companyWebsite,
    location: walkin.location,
    cityName: walkin.cityName,
    salaryMin: walkin.salaryMin,
    salaryMax: walkin.salaryMax,
    currency: walkin.currency,
    status: isPast ? "EXPIRED" : walkin.status,
    isWalkin: true,
    walkinDate: walkin.walkinDate,
    walkinVenue: walkin.walkinVenue,
  });

  const mapsQuery = encodeURIComponent(
    `${walkin.walkinVenue || ""}, ${walkin.cityName || ""}, India`
  );

  return (
    <div className="container-page py-10 sm:py-12 max-w-4xl">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/walkins" className="hover:text-primary transition-colors">
          Walk-in Drives
        </Link>
        {walkin.citySlug && (
          <>
            <span>/</span>
            <Link
              href={`/walkins/${walkin.citySlug}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {walkin.citySlug}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground line-clamp-1">{walkin.title}</span>
      </nav>

      {/* ── Expired Warning Banner ── */}
      {isPast && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">This walk-in interview date has passed.</strong>
            <p className="mt-0.5 text-xs text-red-600">
              This drive was held on {formattedDate}. It remains archived for historical reference. Please check active upcoming walk-ins.
            </p>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border bg-muted/40 overflow-hidden">
              {walkin.companyLogo ? (
                <img
                  src={walkin.companyLogo}
                  alt={`${walkin.companyName} logo`}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <Building2 className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">
                {walkin.companyName}
              </span>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground mt-0.5">
                {walkin.title}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {walkin.cityName || "Central India"}, India
                </span>

                {walkin.verificationStatus === "VERIFIED" ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Walk-In
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    Source: {walkin.sourceType || "Public Submission"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="shrink-0 flex sm:flex-col gap-2.5">
            {walkin.applicationUrl && !isPast && (
              <a
                href={walkin.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
              >
                Apply / Notice Link
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* ── Key Drive Details Bar ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
          <div className="rounded-xl bg-muted/30 p-3.5 border">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Interview Date
            </span>
            <strong className="text-sm font-semibold text-foreground">
              {formattedDate}
            </strong>
          </div>

          <div className="rounded-xl bg-muted/30 p-3.5 border">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Drive Timings
            </span>
            <strong className="text-sm font-semibold text-foreground">
              {walkin.walkinStartTime || "Check notice"}
              {walkin.walkinEndTime ? ` to ${walkin.walkinEndTime}` : ""}
            </strong>
          </div>

          <div className="rounded-xl bg-muted/30 p-3.5 border">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
              <IndianRupee className="h-3.5 w-3.5 text-primary" />
              Compensation
            </span>
            <strong className="text-sm font-semibold text-foreground">
              {walkin.salaryMin && walkin.salaryMax
                ? `₹${walkin.salaryMin.toLocaleString()} - ₹${walkin.salaryMax.toLocaleString()}`
                : "Best in industry / As per norms"}
            </strong>
          </div>
        </div>
      </div>

      {/* ── Venue & Address Section ── */}
      {walkin.walkinVenue && (
        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Interview Venue & Directions
          </h2>
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
            {walkin.walkinVenue}
          </p>
          <div className="mt-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      )}

      {/* ── Description & Requirements ── */}
      <div className="mt-8 rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            About the Role & Drive
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
            {walkin.description || "Refer to the original recruitment announcement link for full candidate instructions."}
          </div>
        </div>

        {/* Skills */}
        {walkin.skills && (
          <div className="border-t pt-5">
            <h3 className="text-sm font-semibold text-foreground mb-2.5">
              Required Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {walkin.skills.split(",").map((s, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact details */}
        {walkin.contactDetails && (
          <div className="border-t pt-5 text-xs text-muted-foreground">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Recruiter / Contact Instructions
            </h3>
            <p>{walkin.contactDetails}</p>
          </div>
        )}

        {/* Source Attribution Notice */}
        <div className="border-t pt-5 text-xs text-muted-foreground bg-muted/20 p-4 rounded-xl">
          <p>
            <strong>Source Attribution:</strong> This announcement was collected via{" "}
            {walkin.sourceType === "TELEGRAM" ? (
              <>Telegram Channel @{walkin.sourceChannel}</>
            ) : (
              walkin.sourceType || "Public Community Submission"
            )}
            . Central India Tech does not charge any fees for walk-in listings. Beware of fraudulent recruiters asking for money.
          </p>
          {walkin.sourceUrl && (
            <p className="mt-2">
              <a
                href={walkin.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Original Announcement Notice →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* ── JSON-LD Structured Data ── */}
      {jobSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </div>
  );
}
