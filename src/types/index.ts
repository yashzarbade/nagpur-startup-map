import type { companies, jobs, events, founders, talentProfiles } from "@/db/schema";

// ─── Database entity types (inferred from Drizzle schema) ───────────────────

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
  sort?: "newest" | "salary-high" | "salary-low";
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
};
