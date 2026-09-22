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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("cities_slug_idx").on(table.slug)]
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
    fundingAmount: varchar("funding_amount", { length: 100 }),
    fundingStage: varchar("funding_stage", { length: 100 }),
    investors: text("investors"),
    verificationStatus: verificationStatusEnum("verification_status")
      .notNull()
      .default("PENDING"),
    claimed: boolean("claimed").notNull().default(false),
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
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("founders_slug_idx").on(table.slug),
    index("founders_company_idx").on(table.companyId),
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
    department: varchar("department", { length: 100 }),
    postedAt: timestamp("posted_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
    status: jobStatusEnum("status").notNull().default("ACTIVE"),
    featured: boolean("featured").notNull().default(false),
    cityId: integer("city_id").references(() => cities.id),
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

// ─── Submissions ────────────────────────────────────────────────────────────

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    type: submissionTypeEnum("type").notNull(),
    data: jsonb("data").notNull(),
    status: submissionStatusEnum("status").notNull().default("PENDING"),
    submitterEmail: varchar("submitter_email", { length: 255 }),
    source: varchar("source", { length: 100 }),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("submissions_status_idx").on(table.status),
    index("submissions_type_idx").on(table.type),
    index("submissions_created_idx").on(table.createdAt),
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
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 200 }),
    linkedinUrl: text("linkedin_url"),
    evidence: text("evidence"),
    status: claimStatusEnum("status").notNull().default("PENDING"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("claims_company_idx").on(table.companyId),
    index("claims_status_idx").on(table.status),
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
