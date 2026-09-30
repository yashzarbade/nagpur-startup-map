import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  serial,
  decimal,
  jsonb,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const verificationStatusEnum = pgEnum("verification_status", [
  "PENDING",
  "VERIFIED",
  "CLAIMED",
  "FEATURED",
  "ARCHIVED",
  "REJECTED",
]);

export const companyStageEnum = pgEnum("company_stage", [
  "BOOTSTRAPPED",
  "PRE_SEED",
  "SEED",
  "SERIES_A",
  "SERIES_B",
  "SERIES_C",
  "GROWTH",
  "PUBLIC",
  "ACQUIRED",
  "UNKNOWN",
]);

export const remoteTypeEnum = pgEnum("remote_type", [
  "ON_SITE",
  "REMOTE",
  "HYBRID",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "ACTIVE",
  "EXPIRED",
  "ARCHIVED",
  "REJECTED",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "MEETUP",
  "HACKATHON",
  "WORKSHOP",
  "DEMO_DAY",
  "NETWORKING",
  "CONFERENCE",
  "STARTUP_PITCH",
  "COLLEGE_EVENT",
  "OTHER",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

export const submissionTypeEnum = pgEnum("submission_type", [
  "COMPANY",
  "JOB",
  "EVENT",
  "FOUNDER",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CHANGES_REQUESTED",
]);

export const claimStatusEnum = pgEnum("claim_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const jobSourceTypeEnum = pgEnum("job_source_type", [
  "GREENHOUSE",
  "ASHBY",
  "GENERIC_CAREERS_PAGE",
  "MANUAL",
  "LINKEDIN",
  "NAUKRI",
  "INDEED",
  "TELEGRAM",
  "WORKABLE",
  "LEVER",
  "WALKIN_SUBMISSION",
]);

export const syncStatusEnum = pgEnum("sync_status", [
  "SUCCESS",
  "FAILED",
  "PARTIAL",
  "RUNNING",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
]);

export const promotionEntityTypeEnum = pgEnum("promotion_entity_type", [
  "COMPANY",
  "JOB",
  "EVENT",
]);

export const userRoleEnum = pgEnum("user_role", [
  "USER",
  "COMPANY",
  "ADMIN",
]);

export const userStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "DISABLED",
]);

export const adminRoleEnum = pgEnum("admin_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "MODERATOR",
]);

export const availabilityEnum = pgEnum("availability_status", [
  "AVAILABLE",
  "OPEN_TO_OFFERS",
  "NOT_AVAILABLE",
]);

// ─── Cities ─────────────────────────────────────────────────────────────────

export const cities = pgTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull().default("India"),
    description: text("description"),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    active: boolean("active").notNull().default(true),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("cities_slug_idx").on(table.slug),
    index("cities_published_idx").on(table.isPublished),
  ]
);

// ─── Companies ──────────────────────────────────────────────────────────────

export const companies = pgTable(
  "companies",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    linkedinUrl: text("linkedin_url"),
    descriptionShort: varchar("description_short", { length: 300 }),
    descriptionLong: text("description_long"),
    sector: varchar("sector", { length: 100 }),
    companyType: varchar("company_type", { length: 100 }).default("Startup"),
    stage: companyStageEnum("stage").default("UNKNOWN"),
    foundedYear: integer("founded_year"),
    teamSize: varchar("team_size", { length: 50 }),
    locationName: varchar("location_name", { length: 200 }),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    address: text("address"),
    cityId: integer("city_id").references(() => cities.id),
    hiring: boolean("hiring").notNull().default(false),
    careersUrl: text("careers_url"),
    jobSourceType: jobSourceTypeEnum("job_source_type"),
    jobSourceIdentifier: varchar("job_source_identifier", { length: 255 }),
    lastJobSyncAt: timestamp("last_job_sync_at"),
    lastJobSyncStatus: syncStatusEnum("last_job_sync_status"),
    fundingAmount: varchar("funding_amount", { length: 100 }),
    fundingStage: varchar("funding_stage", { length: 100 }),
    investors: text("investors"),
    verificationStatus: verificationStatusEnum("verification_status")
      .notNull()
      .default("PENDING"),
    claimed: boolean("claimed").notNull().default(false),
    claimedByUserId: text("claimed_by_user_id"),
    featured: boolean("featured").notNull().default(false),
    xUrl: text("x_url"),
    instagramUrl: text("instagram_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    lastVerifiedAt: timestamp("last_verified_at"),
    verificationSource: varchar("verification_source", { length: 100 }),
  },
  (table) => [
    uniqueIndex("companies_slug_idx").on(table.slug),
    index("companies_sector_idx").on(table.sector),
    index("companies_location_idx").on(table.locationName),
    index("companies_hiring_idx").on(table.hiring),
    index("companies_verification_idx").on(table.verificationStatus),
    index("companies_created_idx").on(table.createdAt),
    index("companies_city_idx").on(table.cityId),
    index("companies_featured_idx").on(table.featured),
  ]
);

// ─── Company Tags ───────────────────────────────────────────────────────────

export const companyTags = pgTable(
  "company_tags",
  {
    id: serial("id").primaryKey(),
    companyId: integer("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    tag: varchar("tag", { length: 100 }).notNull(),
  },
  (table) => [
    index("company_tags_company_idx").on(table.companyId),
    index("company_tags_tag_idx").on(table.tag),
  ]
);

// ─── Founders ───────────────────────────────────────────────────────────────

export const founders = pgTable(
  "founders",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    photoUrl: text("photo_url"),
    companyId: integer("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    role: varchar("role", { length: 200 }),
    bio: text("bio"),
    linkedinUrl: text("linkedin_url"),
    websiteUrl: text("website_url"),
    xUrl: text("x_url"),
    location: varchar("location", { length: 200 }),
    cityId: integer("city_id").references(() => cities.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("founders_slug_idx").on(table.slug),
    index("founders_company_idx").on(table.companyId),
    index("founders_city_idx").on(table.cityId),
  ]
);

// ─── Jobs ───────────────────────────────────────────────────────────────────

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    companyId: integer("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 300 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 200 }),
    remoteType: remoteTypeEnum("remote_type").default("ON_SITE"),
    employmentType: employmentTypeEnum("employment_type").default("FULL_TIME"),
    experienceMin: integer("experience_min"),
    experienceMax: integer("experience_max"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    currency: varchar("currency", { length: 10 }).default("INR"),
    skills: text("skills"), // comma-separated for simplicity in V1
    applicationUrl: text("application_url"),
    sourceUrl: text("source_url"),
    sourceType: jobSourceTypeEnum("source_type"),
    externalJobId: varchar("external_job_id", { length: 255 }),
    lastSeenAt: timestamp("last_seen_at"),
    lastCheckedAt: timestamp("last_checked_at"),
    missedSyncCount: integer("missed_sync_count").notNull().default(0),
    department: varchar("department", { length: 100 }),
    postedAt: timestamp("posted_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
    status: jobStatusEnum("status").notNull().default("ACTIVE"),
    featured: boolean("featured").notNull().default(false),
    cityId: integer("city_id").references(() => cities.id),
    walkinDate: timestamp("walkin_date"),
    walkinStartTime: varchar("walkin_start_time", { length: 50 }),
    walkinEndTime: varchar("walkin_end_time", { length: 50 }),
    walkinVenue: text("walkin_venue"),
    isWalkin: boolean("is_walkin").notNull().default(false),
    sourceChannel: varchar("source_channel", { length: 255 }),
    sourceMessageId: varchar("source_message_id", { length: 100 }),
    sourceJobId: varchar("source_job_id", { length: 255 }),
    verificationStatus: varchar("verification_status", { length: 50 }).notNull().default("PENDING"),
    moderationStatus: varchar("moderation_status", { length: 50 }).notNull().default("APPROVED"),
    firstSeenAt: timestamp("first_seen_at").defaultNow(),
    deduplicationKey: varchar("deduplication_key", { length: 255 }),
    contactDetails: text("contact_details"),
    rawData: jsonb("raw_data"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("jobs_slug_idx").on(table.slug),
    index("jobs_company_idx").on(table.companyId),
    index("jobs_status_idx").on(table.status),
    index("jobs_expires_idx").on(table.expiresAt),
    index("jobs_posted_idx").on(table.postedAt),
    index("jobs_location_idx").on(table.location),
    index("jobs_title_idx").on(table.title),
    index("jobs_featured_idx").on(table.featured),
    index("jobs_city_idx").on(table.cityId),
    index("jobs_source_type_idx").on(table.sourceType),
    index("jobs_external_id_idx").on(table.sourceType, table.externalJobId),
    index("jobs_is_walkin_idx").on(table.isWalkin),
    index("jobs_walkin_date_idx").on(table.walkinDate),
    index("jobs_city_walkin_idx").on(table.cityId, table.isWalkin),
    index("jobs_dedup_key_idx").on(table.deduplicationKey),
    index("jobs_source_job_id_idx").on(table.sourceType, table.sourceJobId),
    index("jobs_moderation_idx").on(table.moderationStatus),
  ]
);

// ─── Job Sync Runs ──────────────────────────────────────────────────────────

export const jobSyncRuns = pgTable(
  "job_sync_runs",
  {
    id: serial("id").primaryKey(),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    status: syncStatusEnum("status").notNull().default("RUNNING"),
    triggeredBy: varchar("triggered_by", { length: 50 }).notNull().default("CRON"),
    companiesChecked: integer("companies_checked").notNull().default(0),
    jobsFound: integer("jobs_found").notNull().default(0),
    jobsCreated: integer("jobs_created").notNull().default(0),
    jobsUpdated: integer("jobs_updated").notNull().default(0),
    jobsExpired: integer("jobs_expired").notNull().default(0),
    errors: integer("errors").notNull().default(0),
    errorLog: jsonb("error_log"),
  },
  (table) => [
    index("sync_runs_started_idx").on(table.startedAt),
    index("sync_runs_status_idx").on(table.status),
  ]
);

// ─── Events ─────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    eventType: eventTypeEnum("event_type").default("OTHER"),
    organizer: varchar("organizer", { length: 255 }),
    date: timestamp("date").notNull(),
    startTime: varchar("start_time", { length: 20 }),
    endTime: varchar("end_time", { length: 20 }),
    venue: varchar("venue", { length: 255 }),
    location: varchar("location", { length: 255 }),
    registrationUrl: text("registration_url"),
    price: varchar("price", { length: 100 }),
    imageUrl: text("image_url"),
    status: eventStatusEnum("status").notNull().default("UPCOMING"),
    featured: boolean("featured").notNull().default(false),
    cityId: integer("city_id").references(() => cities.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("events_slug_idx").on(table.slug),
    index("events_date_idx").on(table.date),
    index("events_status_idx").on(table.status),
    index("events_city_idx").on(table.cityId),
  ]
);

// ─── Talent Profiles ────────────────────────────────────────────────────────

export const talentProfiles = pgTable(
  "talent_profiles",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    headline: varchar("headline", { length: 300 }),
    skills: text("skills"), // comma-separated
    location: varchar("location", { length: 200 }),
    experience: varchar("experience", { length: 100 }),
    availability: availabilityEnum("availability").default("OPEN_TO_OFFERS"),
    portfolioUrl: text("portfolio_url"),
    githubUrl: text("github_url"),
    linkedinUrl: text("linkedin_url"),
    resumeUrl: text("resume_url"),
    visible: boolean("visible").notNull().default(true),
    cityId: integer("city_id").references(() => cities.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("talent_slug_idx").on(table.slug),
    index("talent_visible_idx").on(table.visible),
    index("talent_city_idx").on(table.cityId),
  ]
);

// ─── User Profiles ─────────────────────────────────────────────────────────

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    email: varchar("email", { length: 255 }),
    fullName: varchar("full_name", { length: 255 }),
    username: varchar("username", { length: 100 }),
    avatar: text("avatar"),
    bio: text("bio"),
    location: varchar("location", { length: 200 }),
    city: varchar("city", { length: 100 }),
    skills: text("skills"),
    linkedinUrl: text("linkedin_url"),
    githubUrl: text("github_url"),
    portfolioUrl: text("portfolio_url"),
    role: userRoleEnum("role").notNull().default("USER"),
    status: userStatusEnum("status").notNull().default("ACTIVE"),
    claimedCompanyId: integer("claimed_company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_profiles_user_id_idx").on(table.userId),
    uniqueIndex("user_profiles_username_idx").on(table.username),
  ]
);

// ─── Submissions ────────────────────────────────────────────────────────────

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id"),
    type: submissionTypeEnum("type").notNull(),
    data: jsonb("data").notNull(),
    status: submissionStatusEnum("status").notNull().default("PENDING"),
    submitterEmail: varchar("submitter_email", { length: 255 }),
    source: varchar("source", { length: 100 }),
    adminNotes: text("admin_notes"),
    rejectionReason: text("rejection_reason"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by"),
    cityId: integer("city_id").references(() => cities.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("submissions_status_idx").on(table.status),
    index("submissions_type_idx").on(table.type),
    index("submissions_user_id_idx").on(table.userId),
    index("submissions_created_idx").on(table.createdAt),
    index("submissions_city_idx").on(table.cityId),
  ]
);

// ─── Claims ─────────────────────────────────────────────────────────────────

export const claims = pgTable(
  "claims",
  {
    id: serial("id").primaryKey(),
    companyId: integer("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    userId: text("user_id"),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 200 }),
    linkedinUrl: text("linkedin_url"),
    evidence: text("evidence"),
    status: claimStatusEnum("status").notNull().default("PENDING"),
    adminNotes: text("admin_notes"),
    rejectionReason: text("rejection_reason"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("claims_company_idx").on(table.companyId),
    index("claims_status_idx").on(table.status),
  ]
);

// ─── Saved Jobs ─────────────────────────────────────────────────────────────

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("saved_jobs_user_id_idx").on(table.userId),
    uniqueIndex("saved_jobs_user_job_idx").on(table.userId, table.jobId),
  ]
);

// ─── Saved Companies ────────────────────────────────────────────────────────

export const savedCompanies = pgTable(
  "saved_companies",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    companyId: integer("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("saved_companies_user_id_idx").on(table.userId),
    uniqueIndex("saved_companies_user_company_idx").on(table.userId, table.companyId),
  ]
);

// ─── Notifications ──────────────────────────────────────────────────────────

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 50 }).notNull().default("INFO"),
    isRead: boolean("is_read").notNull().default(false),
    link: text("link"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId),
    index("notifications_user_read_idx").on(table.userId, table.isRead),
  ]
);

// ─── Promotions ─────────────────────────────────────────────────────────────

export const promotions = pgTable(
  "promotions",
  {
    id: serial("id").primaryKey(),
    entityType: promotionEntityTypeEnum("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    plan: varchar("plan", { length: 100 }).notNull(),
    amount: integer("amount").notNull(), // in paise (INR smallest unit)
    currency: varchar("currency", { length: 10 }).notNull().default("INR"),
    startsAt: timestamp("starts_at").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    paymentStatus: paymentStatusEnum("payment_status")
      .notNull()
      .default("PENDING"),
    paymentReference: varchar("payment_reference", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("promotions_entity_idx").on(table.entityType, table.entityId),
    index("promotions_status_idx").on(table.paymentStatus),
    index("promotions_expires_idx").on(table.expiresAt),
  ]
);

// ─── Newsletter Subscribers ─────────────────────────────────────────────────

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("newsletter_email_idx").on(table.email)]
);

// ─── Admin Actions Log ──────────────────────────────────────────────────────

export const adminActions = pgTable(
  "admin_actions",
  {
    id: serial("id").primaryKey(),
    adminId: varchar("admin_id", { length: 255 }),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 100 }),
    entityId: integer("entity_id"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("admin_actions_admin_idx").on(table.adminId),
    index("admin_actions_created_idx").on(table.createdAt),
  ]
);

// ─── Job Source Health ──────────────────────────────────────────────────────

export const jobSourceHealth = pgTable(
  "job_source_health",
  {
    id: serial("id").primaryKey(),
    sourceType: varchar("source_type", { length: 50 }).notNull(),
    sourceName: varchar("source_name", { length: 100 }).notNull(),
    citySlug: varchar("city_slug", { length: 50 }),
    status: varchar("status", { length: 50 }).notNull().default("IDLE"),
    lastSyncAt: timestamp("last_sync_at"),
    lastSuccessAt: timestamp("last_success_at"),
    jobsDiscovered: integer("jobs_discovered").notNull().default(0),
    jobsInserted: integer("jobs_inserted").notNull().default(0),
    jobsUpdated: integer("jobs_updated").notNull().default(0),
    jobsExpired: integer("jobs_expired").notNull().default(0),
    errorSummary: text("error_summary"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("job_source_health_type_idx").on(table.sourceType),
    index("job_source_health_city_idx").on(table.citySlug),
  ]
);

// ─── Application Status Enum ────────────────────────────────────────────────

export const applicationStatusEnum = pgEnum("application_status", [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "HIRED",
  "WITHDRAWN",
]);

// ─── Job Applications ───────────────────────────────────────────────────────

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    companyId: integer("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    status: applicationStatusEnum("status").notNull().default("APPLIED"),
    coverMessage: text("cover_message"),
    resumeUrl: text("resume_url"),
    portfolioUrl: text("portfolio_url"),
    linkedinUrl: text("linkedin_url"),
    githubUrl: text("github_url"),
    applicantName: varchar("applicant_name", { length: 255 }),
    applicantEmail: varchar("applicant_email", { length: 255 }),
    adminNotes: text("admin_notes"),
    statusChangedAt: timestamp("status_changed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("job_applications_user_idx").on(table.userId),
    index("job_applications_job_idx").on(table.jobId),
    index("job_applications_company_idx").on(table.companyId),
    index("job_applications_status_idx").on(table.status),
    uniqueIndex("job_applications_user_job_idx").on(table.userId, table.jobId),
    index("job_applications_created_idx").on(table.createdAt),
  ]
);

// ─── Alert Frequency Enum ───────────────────────────────────────────────────

export const alertFrequencyEnum = pgEnum("alert_frequency", [
  "INSTANT",
  "DAILY",
  "WEEKLY",
]);

// ─── Job Alerts ─────────────────────────────────────────────────────────────

export const jobAlerts = pgTable(
  "job_alerts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    cityId: integer("city_id").references(() => cities.id),
    keyword: varchar("keyword", { length: 255 }),
    sector: varchar("sector", { length: 100 }),
    skills: text("skills"), // comma-separated
    experienceLevel: varchar("experience_level", { length: 50 }),
    employmentType: varchar("employment_type", { length: 50 }),
    remoteType: varchar("remote_type", { length: 50 }),
    frequency: alertFrequencyEnum("frequency").notNull().default("DAILY"),
    active: boolean("active").notNull().default(true),
    lastNotifiedAt: timestamp("last_notified_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("job_alerts_user_idx").on(table.userId),
    index("job_alerts_active_idx").on(table.active),
    index("job_alerts_city_idx").on(table.cityId),
  ]
);
