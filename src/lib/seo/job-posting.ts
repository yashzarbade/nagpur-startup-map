import { SITE } from "@/lib/constants";

export interface JobPostingSchemaInput {
  title: string;
  description?: string | null;
  postedAt: Date | string;
  expiresAt?: Date | string | null;
  employmentType?: string | null;
  remoteType?: string | null;
  companyName: string;
  companyWebsite?: string | null;
  location?: string | null;
  cityName?: string | null;
  stateName?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  status: string;
  isWalkin?: boolean;
  walkinDate?: Date | string | null;
  walkinVenue?: string | null;
}

/**
 * Generate Schema.org JobPosting JSON-LD.
 * Only returns valid JSON-LD when the job is ACTIVE.
 * Returns null if the job is expired, rejected, or unverified/empty.
 */
export function generateJobPostingSchema(job: JobPostingSchemaInput): Record<string, any> | null {
  // Never emit JobPosting schema for expired or non-active jobs
  if (job.status !== "ACTIVE") {
    return null;
  }

  const postedDate = new Date(job.postedAt).toISOString();
  
  // Expiry date: if walk-in, expiry is end of walk-in day. Otherwise expiresAt or 30 days.
  let validThrough: string;
  if (job.isWalkin && job.walkinDate) {
    const wDate = new Date(job.walkinDate);
    wDate.setHours(23, 59, 59, 999);
    validThrough = wDate.toISOString();
  } else if (job.expiresAt) {
    validThrough = new Date(job.expiresAt).toISOString();
  } else {
    const expiry = new Date(job.postedAt);
    expiry.setDate(expiry.getDate() + 30);
    validThrough = expiry.toISOString();
  }

  // Check if validThrough is already in the past
  if (new Date(validThrough).getTime() < Date.now()) {
    return null;
  }

  // Employment type mapping to schema.org enum
  const mapEmploymentType: Record<string, string> = {
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACTOR",
    INTERNSHIP: "INTERN",
    FREELANCE: "OTHER",
  };

  const schemaEmploymentType = job.employmentType
    ? mapEmploymentType[job.employmentType] || "FULL_TIME"
    : "FULL_TIME";

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description
      ? job.description.replace(/<[^>]*>/g, " ").trim()
      : `${job.title} role at ${job.companyName} in ${job.location || job.cityName || "Central India"}.`,
    datePosted: postedDate,
    validThrough: validThrough,
    employmentType: schemaEmploymentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      sameAs: job.companyWebsite || SITE.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.cityName || "Nagpur",
        addressRegion: job.stateName || "Maharashtra",
        addressCountry: "IN",
        streetAddress: job.walkinVenue || undefined,
      },
    },
  };

  // Remote specifications
  if (job.remoteType === "REMOTE") {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = {
      "@type": "Country",
      name: "India",
    };
  }

  // Salary specification
  if (job.salaryMin || job.salaryMax) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency || "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin || job.salaryMax,
        maxValue: job.salaryMax || job.salaryMin,
        unitText: "YEAR",
      },
    };
  }

  return schema;
}
