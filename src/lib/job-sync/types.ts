// ─── Job Sync Types ─────────────────────────────────────────────────────────

export type JobSourceType =
  | "GREENHOUSE"
  | "ASHBY"
  | "GENERIC_CAREERS_PAGE"
  | "MANUAL"
  | "LINKEDIN"
  | "NAUKRI"
  | "INDEED"
  | "TELEGRAM"
  | "WORKABLE"
  | "LEVER"
  | "WALKIN_SUBMISSION";

export type SyncStatus = "SUCCESS" | "FAILED" | "PARTIAL" | "RUNNING";

/**
 * Normalized job from any source, ready for deduplication and upsert.
 */
export interface NormalizedJob {
  title: string;
  companyName?: string;
  companySlug?: string;
  description: string | null;
  location: string | null;
  cityId?: number | null;
  citySlug?: string | null;
  remoteType: "ON_SITE" | "REMOTE" | "HYBRID" | null;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE" | null;
  applicationUrl: string;
  sourceUrl: string | null;
  sourceType: JobSourceType;
  externalJobId: string | null;
  department: string | null;
  postedAt: Date | null;
  expiresAt?: Date | null;
  skills: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  isWalkin?: boolean;
  walkinDate?: Date | null;
  walkinStartTime?: string | null;
  walkinEndTime?: string | null;
  walkinVenue?: string | null;
  sourceChannel?: string | null;
  sourceMessageId?: string | null;
  sourceJobId?: string | null;
  verificationStatus?: "PENDING" | "VERIFIED";
  moderationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  contactDetails?: string | null;
  rawData?: any;
}

/**
 * Result from syncing one company.
 */
export interface CompanySyncResult {
  companyId: number;
  companyName: string;
  sourceType: JobSourceType;
  success: boolean;
  jobsFound: number;
  jobsCreated: number;
  jobsUpdated: number;
  jobsExpired: number;
  error?: string;
}

/**
 * Overall sync run result.
 */
export interface SyncRunResult {
  companiesChecked: number;
  jobsFound: number;
  jobsCreated: number;
  jobsUpdated: number;
  jobsExpired: number;
  errors: number;
  details: CompanySyncResult[];
}

/**
 * Detected source info from a careers URL.
 */
export interface DetectedSource {
  sourceType: JobSourceType;
  identifier: string | null;
}

/**
 * A company eligible for job syncing.
 */
export interface SyncableCompany {
  id: number;
  cityId: number | null;
  name: string;
  slug: string;
  careersUrl: string;
  jobSourceType: JobSourceType | null;
  jobSourceIdentifier: string | null;
}

