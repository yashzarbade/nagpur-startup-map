import type {
  cities,
  companies,
  jobs,
  events,
  founders,
  talentProfiles,
  userProfiles,
  submissions,
  claims,
  savedJobs,
  savedCompanies,
  notifications,
  jobSourceHealth,
  jobApplications,
  jobAlerts,
} from "@/db/schema";

// ─── Database entity types (inferred from Drizzle schema) ───────────────────

export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Founder = typeof founders.$inferSelect;
export type NewFounder = typeof founders.$inferInsert;

export type TalentProfile = typeof talentProfiles.$inferSelect;
export type NewTalentProfile = typeof talentProfiles.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;

export type SavedJob = typeof savedJobs.$inferSelect;
export type SavedCompany = typeof savedCompanies.$inferSelect;

export type Notification = typeof notifications.$inferSelect;
export type JobSourceHealth = typeof jobSourceHealth.$inferSelect;
export type NewJobSourceHealth = typeof jobSourceHealth.$inferInsert;

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

export type JobAlert = typeof jobAlerts.$inferSelect;
export type NewJobAlert = typeof jobAlerts.$inferInsert;

// ─── View types (enriched types for UI consumption) ─────────────────────────

export type CompanyWithFounders = Company & {
  founders: Founder[];
};

export type CompanyWithJobs = Company & {
  jobs: Job[];
  activeJobCount: number;
};

export type CompanyCard = {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  descriptionShort: string | null;
  sector: string | null;
  companyType?: string | null;
  locationName: string | null;
  hiring: boolean;
  activeJobCount: number;
  teamSize: string | null;
  verificationStatus: string;
  featured: boolean;
  tags: string[];
};

export type JobCard = {
  id: number;
  title: string;
  slug: string;
  companyName: string;
  companySlug: string;
  companyLogo: string | null;
  location: string | null;
  remoteType: string | null;
  employmentType: string | null;
  experienceMin: number | null;
  experienceMax: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  skills: string | null;
  postedAt: Date;
  featured: boolean;
  isWalkin?: boolean;
  walkinDate?: Date | null;
  walkinStartTime?: string | null;
  walkinEndTime?: string | null;
  walkinVenue?: string | null;
  verificationStatus?: string;
  sourceType?: string | null;
  sourceUrl?: string | null;
  applicationUrl?: string | null;
};

export type WalkinCard = {
  id: number;
  title: string;
  slug: string;
  companyName: string;
  companySlug: string;
  companyLogo: string | null;
  location: string | null;
  cityId: number | null;
  cityName?: string;
  citySlug?: string;
  walkinDate: Date;
  walkinStartTime: string | null;
  walkinEndTime: string | null;
  walkinVenue: string | null;
  experienceMin: number | null;
  experienceMax: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  skills: string | null;
  applicationUrl: string | null;
  sourceUrl: string | null;
  sourceType: string | null;
  verificationStatus: string;
  status: string;
  featured: boolean;
};

export type EventCard = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  eventType: string | null;
  organizer: string | null;
  date: Date;
  startTime: string | null;
  venue: string | null;
  location: string | null;
  registrationUrl: string | null;
  price: string | null;
  imageUrl: string | null;
  status: string;
  featured: boolean;
};

export type FounderCard = {
  id: number;
  name: string;
  slug: string;
  photoUrl: string | null;
  companyName: string | null;
  companySlug: string | null;
  role: string | null;
  bio: string | null;
  linkedinUrl: string | null;
};

export type TalentCard = {
  id: number;
  name: string;
  slug: string;
  headline: string | null;
  skills: string | null;
  location: string | null;
  experience: string | null;
  availability: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
};

// ─── Search Types ───────────────────────────────────────────────────────────

export type SearchResult = {
  companies: CompanyCard[];
  jobs: JobCard[];
  founders: FounderCard[];
  events: EventCard[];
};

// ─── Filter Types ───────────────────────────────────────────────────────────

export type StartupFilters = {
  search?: string;
  sector?: string;
  area?: string;
  hiring?: boolean;
  stage?: string;
  teamSize?: string;
  foundedYear?: string;
  cityId?: number;
  citySlug?: string;
  sort?: "newest" | "oldest" | "az" | "za" | "team-size";
  page?: number;
};

export type JobFilters = {
  search?: string;
  sector?: string;
  employmentType?: string;
  remoteType?: string;
  experience?: string;
  department?: string;
  freshness?: "today" | "week" | "month";
  cityId?: number;
  citySlug?: string;
  sort?: "newest" | "salary-high" | "salary-low";
  page?: number;
  isWalkin?: boolean;
};

export type WalkinFilters = {
  search?: string;
  citySlug?: string;
  cityId?: number;
  freshness?: "upcoming" | "today" | "all";
  sort?: "upcoming" | "newest";
  page?: number;
};

// ─── Stats ──────────────────────────────────────────────────────────────────

export type EcosystemStats = {
  totalCompanies: number;
  totalJobs: number;
  totalFounders: number;
  totalEvents: number;
  hiringCompanies: number;
};

// ─── Map Types ──────────────────────────────────────────────────────────────

export type MapMarker = {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  sector: string | null;
  locationName: string | null;
  latitude: number;
  longitude: number;
  hiring: boolean;
  cityId?: number | null;
};
