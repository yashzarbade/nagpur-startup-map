// ─── Sectors ────────────────────────────────────────────────────────────────

export const SECTORS = [
  { label: "AI", slug: "ai", description: "Artificial Intelligence, Machine Learning, Computer Vision, NLP and AI-powered products" },
  { label: "SaaS", slug: "saas", description: "Software as a Service products and platforms" },
  { label: "Fintech", slug: "fintech", description: "Financial technology, payments, lending and insurance" },
  { label: "Healthtech", slug: "healthtech", description: "Healthcare technology, medtech and health platforms" },
  { label: "Edtech", slug: "edtech", description: "Education technology, e-learning and skill development" },
  { label: "D2C", slug: "d2c", description: "Direct-to-consumer brands and ecommerce" },
  { label: "Deeptech", slug: "deeptech", description: "Deep technology, research-driven startups" },
  { label: "Agritech", slug: "agritech", description: "Agriculture technology and food-tech" },
  { label: "Mobility", slug: "mobility", description: "Transportation, logistics and electric vehicles" },
  { label: "Ecommerce", slug: "ecommerce", description: "Online marketplaces and digital commerce" },
  { label: "IT Services", slug: "it-services", description: "IT consulting, software services and outsourcing" },
  { label: "Software", slug: "software", description: "Software development and product engineering" },
  { label: "Manufacturing Tech", slug: "manufacturing-tech", description: "Industrial technology and smart manufacturing" },
  { label: "Cybersecurity", slug: "cybersecurity", description: "Information security, data protection and privacy" },
  { label: "Media & Marketing", slug: "media-marketing", description: "Digital marketing, content, social media and advertising" },
  { label: "Real Estate Tech", slug: "real-estate-tech", description: "Property technology and construction tech" },
  { label: "Other", slug: "other", description: "Startups across other emerging sectors" },
] as const;

export const SECTOR_SLUGS = SECTORS.map((s) => s.slug);

// ─── Areas (Nagpur) ─────────────────────────────────────────────────────────

export const AREAS = [
  { label: "MIHAN", slug: "mihan" },
  { label: "IT Park", slug: "it-park" },
  { label: "Civil Lines", slug: "civil-lines" },
  { label: "Dharampeth", slug: "dharampeth" },
  { label: "Ramdaspeth", slug: "ramdaspeth" },
  { label: "Sadar", slug: "sadar" },
  { label: "Hingna", slug: "hingna" },
  { label: "Pratap Nagar", slug: "pratap-nagar" },
  { label: "Bajaj Nagar", slug: "bajaj-nagar" },
  { label: "Besa", slug: "besa" },
  { label: "Wardha Road", slug: "wardha-road" },
  { label: "Manish Nagar", slug: "manish-nagar" },
  { label: "Manewada", slug: "manewada" },
  { label: "Central Avenue", slug: "central-avenue" },
  { label: "Gandhibagh", slug: "gandhibagh" },
  { label: "Itwari", slug: "itwari" },
  { label: "Katol Road", slug: "katol-road" },
  { label: "Koradi Road", slug: "koradi-road" },
  { label: "Trimurti Nagar", slug: "trimurti-nagar" },
  { label: "Wathoda", slug: "wathoda" },
  { label: "Vivekanand Nagar", slug: "vivekanand-nagar" },
  { label: "Ghat Road", slug: "ghat-road" },
  { label: "Sitabuldi", slug: "sitabuldi" },
  { label: "Laxmi Nagar", slug: "laxmi-nagar" },
  { label: "Butibori", slug: "butibori" },
] as const;

export const AREA_SLUGS = AREAS.map((a) => a.slug);

// ─── Company Stages ─────────────────────────────────────────────────────────

export const COMPANY_STAGES = [
  { label: "Bootstrapped", value: "BOOTSTRAPPED" },
  { label: "Pre-Seed", value: "PRE_SEED" },
  { label: "Seed", value: "SEED" },
  { label: "Series A", value: "SERIES_A" },
  { label: "Series B", value: "SERIES_B" },
  { label: "Series C+", value: "SERIES_C" },
  { label: "Growth", value: "GROWTH" },
  { label: "Public", value: "PUBLIC" },
  { label: "Acquired", value: "ACQUIRED" },
] as const;

// ─── Team Size Ranges ───────────────────────────────────────────────────────

export const TEAM_SIZES = [
  { label: "1-10", value: "1-10" },
  { label: "11-50", value: "11-50" },
  { label: "51-200", value: "51-200" },
  { label: "201-500", value: "201-500" },
  { label: "501-1000", value: "501-1000" },
  { label: "1000+", value: "1000+" },
] as const;

// ─── Employment Types ───────────────────────────────────────────────────────

export const EMPLOYMENT_TYPES = [
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Freelance", value: "FREELANCE" },
] as const;

// ─── Remote Types ───────────────────────────────────────────────────────────

export const REMOTE_TYPES = [
  { label: "On-site", value: "ON_SITE" },
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
] as const;

// ─── Event Types ────────────────────────────────────────────────────────────

export const EVENT_TYPES = [
  { label: "Meetup", value: "MEETUP" },
  { label: "Hackathon", value: "HACKATHON" },
  { label: "Workshop", value: "WORKSHOP" },
  { label: "Demo Day", value: "DEMO_DAY" },
  { label: "Networking", value: "NETWORKING" },
  { label: "Conference", value: "CONFERENCE" },
  { label: "Startup Pitch", value: "STARTUP_PITCH" },
  { label: "College Event", value: "COLLEGE_EVENT" },
  { label: "Other", value: "OTHER" },
] as const;

// ─── Verification Statuses ──────────────────────────────────────────────────

export const VERIFICATION_STATUSES = [
  { label: "Pending", value: "PENDING", color: "yellow" },
  { label: "Verified", value: "VERIFIED", color: "green" },
  { label: "Claimed", value: "CLAIMED", color: "blue" },
  { label: "Featured", value: "FEATURED", color: "purple" },
  { label: "Archived", value: "ARCHIVED", color: "gray" },
  { label: "Rejected", value: "REJECTED", color: "red" },
] as const;

// ─── Promotion Pricing (in INR) ─────────────────────────────────────────────

export const PROMOTION_PRICING = {
  COMPANY: [
    { label: "7 days", days: 7, price: 299 },
    { label: "14 days", days: 14, price: 499 },
    { label: "30 days", days: 30, price: 799 },
  ],
  JOB: [
    { label: "7 days", days: 7, price: 199 },
    { label: "14 days", days: 14, price: 399 },
    { label: "30 days", days: 30, price: 599 },
  ],
  EVENT: [
    { label: "7 days", days: 7, price: 199 },
    { label: "14 days", days: 14, price: 399 },
    { label: "30 days", days: 30, price: 699 },
  ],
} as const;

// ─── Job Departments ────────────────────────────────────────────────────────

export const JOB_DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "HR",
  "Finance",
  "Data Science",
  "AI/ML",
  "DevOps",
  "QA",
  "Customer Support",
  "Other",
] as const;

// ─── Job Categories for SEO pages ───────────────────────────────────────────

export const JOB_CATEGORIES = [
  { label: "Software Engineer", slug: "software-engineer" },
  { label: "Full Stack Developer", slug: "full-stack-developer" },
  { label: "Frontend Developer", slug: "frontend-developer" },
  { label: "Backend Developer", slug: "backend-developer" },
  { label: "AI Engineer", slug: "ai-engineer" },
  { label: "Data Scientist", slug: "data-scientist" },
  { label: "DevOps Engineer", slug: "devops-engineer" },
  { label: "Product Manager", slug: "product-manager" },
  { label: "UI/UX Designer", slug: "ui-ux-designer" },
  { label: "Mobile Developer", slug: "mobile-developer" },
  { label: "Internships", slug: "internships" },
] as const;

// ─── Site Metadata ──────────────────────────────────────────────────────────

export const SITE = {
  name: "Central India Tech",
  tagline: "Discover companies, startups, jobs, events and opportunities across Central India.",
  description:
    "Explore startups, technology companies, founders, jobs, events and emerging businesses across Central India, featuring Nagpur, Indore, and Bhopal.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://centralindiatech.com",
  twitter: "@centralindiatech",
  defaultCity: "Nagpur",
  defaultState: "Maharashtra",
  defaultCountry: "India",
  mapCenter: { lat: 21.1458, lng: 79.0882 } as const,
  mapZoom: 12,
} as const;

// ─── Pagination ─────────────────────────────────────────────────────────────

export const ITEMS_PER_PAGE = 24;
export const JOBS_PER_PAGE = 20;
export const EVENTS_PER_PAGE = 12;

// ─── Job Expiry ─────────────────────────────────────────────────────────────

export const DEFAULT_JOB_EXPIRY_DAYS = 30;
