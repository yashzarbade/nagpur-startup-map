import { db } from "@/db";
import { cities } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { City } from "@/types";
import { SITE } from "@/lib/constants";

export interface CityConfig {
  id?: number;
  name: string;
  slug: string;
  state: string;
  country: string;
  description: string;
  tagline: string;
  latitude: number;
  longitude: number;
  zoom: number;
  isPublished: boolean;
  active: boolean;
  areas: Array<{ label: string; slug: string }>;
}

export const KNOWN_CITIES: Record<string, CityConfig> = {
  nagpur: {
    name: "Nagpur",
    slug: "nagpur",
    state: "Maharashtra",
    country: "India",
    tagline: "Discover Nagpur's startups, tech companies, jobs and opportunities.",
    description:
      "Explore startups, technology companies, founders, jobs, events and emerging businesses across Nagpur.",
    latitude: 21.1458,
    longitude: 79.0882,
    zoom: 12,
    isPublished: true,
    active: true,
    areas: [
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
      { label: "Central Avenue", slug: "central-avenue" },
    ],
  },
  indore: {
    name: "Indore",
    slug: "indore",
    state: "Madhya Pradesh",
    country: "India",
    tagline: "Discover Indore's startups, tech companies, jobs and opportunities.",
    description:
      "Explore startups, technology companies, founders, jobs, events and emerging businesses across Indore.",
    latitude: 22.7196,
    longitude: 75.8577,
    zoom: 12,
    isPublished: true,
    active: true,
    areas: [
      { label: "Super Corridor", slug: "super-corridor" },
      { label: "Vijay Nagar", slug: "vijay-nagar" },
      { label: "Crystal IT Park", slug: "crystal-it-park" },
      { label: "Palasia", slug: "palasia" },
      { label: "Bhawarkua", slug: "bhawarkua" },
      { label: "AB Road", slug: "ab-road" },
      { label: "Pithampur Tech Zone", slug: "pithampur-tech-zone" },
      { label: "Tukoganj", slug: "tukoganj" },
      { label: "MR 10", slug: "mr-10" },
      { label: "Geeta Bhawan", slug: "geeta-bhawan" },
    ],
  },
  bhopal: {
    name: "Bhopal",
    slug: "bhopal",
    state: "Madhya Pradesh",
    country: "India",
    tagline: "Discover Bhopal's startups, tech companies, jobs and opportunities.",
    description:
      "Explore startups, technology companies, founders, jobs, events and emerging businesses across Bhopal.",
    latitude: 23.2599,
    longitude: 77.4126,
    zoom: 12,
    isPublished: true,
    active: true,
    areas: [
      { label: "MP Nagar", slug: "mp-nagar" },
      { label: "Arera Colony", slug: "arera-colony" },
      { label: "Kolar Road", slug: "kolar-road" },
      { label: "Govindpura Industrial Area", slug: "govindpura" },
      { label: "Mandideep Tech Zone", slug: "mandideep" },
      { label: "Hoshangabad Road", slug: "hoshangabad-road" },
      { label: "BHEL Township", slug: "bhel" },
      { label: "TT Nagar", slug: "tt-nagar" },
      { label: "Malviya Nagar", slug: "malviya-nagar" },
      { label: "Bawadiya Kalan", slug: "bawadiya-kalan" },
    ],
  },
};

export const DEFAULT_CITY_SLUG = "nagpur";

/**
 * Get a city by slug (from database with fallback to known cities)
 */
export async function getCityBySlug(slug: string): Promise<City | null> {
  const normalized = slug.toLowerCase().trim();
  try {
    const [city] = await db
      .select()
      .from(cities)
      .where(eq(cities.slug, normalized))
      .limit(1);

    if (city) {
      return city;
    }
  } catch (error) {
    console.error(`[cities] Database error fetching city '${slug}':`, error);
  }

  // Fallback to static known cities
  const known = KNOWN_CITIES[normalized];
  if (known) {
    const fallbackId = normalized === "nagpur" ? 1 : normalized === "indore" ? 3 : 6;
    return {
      id: fallbackId,
      name: known.name,
      slug: known.slug,
      state: known.state,
      country: known.country,
      description: known.description,
      latitude: known.latitude.toString(),
      longitude: known.longitude.toString(),
      active: known.active,
      isPublished: known.isPublished,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return null;
}

/**
 * Get all published cities (for public routes and sitemap)
 */
export async function getAllPublishedCities(): Promise<City[]> {
  try {
    const list = await db
      .select()
      .from(cities)
      .where(eq(cities.isPublished, true))
      .orderBy(asc(cities.name));

    if (list.length > 0) return list;
  } catch (error) {
    console.error("[cities] Error fetching published cities from DB:", error);
  }

  // Fallback
  return Object.values(KNOWN_CITIES)
    .filter((c) => c.isPublished)
    .map((c, index) => ({
      id: index + 1,
      name: c.name,
      slug: c.slug,
      state: c.state,
      country: c.country,
      description: c.description,
      latitude: c.latitude.toString(),
      longitude: c.longitude.toString(),
      active: c.active,
      isPublished: c.isPublished,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
}

/**
 * Get all cities including unpublished (for admin and city switcher)
 */
export async function getAllCities(): Promise<City[]> {
  try {
    const list = await db
      .select()
      .from(cities)
      .orderBy(asc(cities.name));

    if (list.length > 0) return list;
  } catch (error) {
    console.error("[cities] Error fetching all cities from DB:", error);
  }

  // Fallback
  return Object.values(KNOWN_CITIES).map((c, index) => ({
    id: index + 1,
    name: c.name,
    slug: c.slug,
    state: c.state,
    country: c.country,
    description: c.description,
    latitude: c.latitude.toString(),
    longitude: c.longitude.toString(),
    active: c.active,
    isPublished: c.isPublished,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

/**
 * Helper to get areas for a city
 */
export function getCityAreas(citySlug: string) {
  const normalized = citySlug.toLowerCase().trim();
  const known = KNOWN_CITIES[normalized];
  return known?.areas || [];
}

/**
 * Generate SEO metadata for a city page
 */
export function getCityMetadata(city: City, section?: string) {
  const cityName = city.name;
  const stateName = city.state;

  if (!section) {
    return {
      title: `${cityName} Startup Map — Startups, Tech Companies & Jobs in ${cityName}`,
      description: `Explore startups, technology companies, founders, jobs, events and emerging businesses across ${cityName}, ${stateName}.`,
      alternates: {
        canonical: `${SITE.url}/${city.slug}`,
      },
      openGraph: {
        title: `${cityName} Startup Map — Startups & Ecosystem`,
        description: `Discover startups, tech companies, founders and jobs in ${cityName}, ${stateName}.`,
        url: `${SITE.url}/${city.slug}`,
      },
    };
  }

  const titles: Record<string, { title: string; desc: string; path: string }> = {
    startups: {
      title: `Startups & Tech Companies in ${cityName} | ${cityName} Startup Map`,
      desc: `Browse verified startups, SaaS companies, AI ventures and tech businesses in ${cityName}, ${stateName}.`,
      path: `/${city.slug}/startups`,
    },
    jobs: {
      title: `Startup Jobs in ${cityName} | ${cityName} Startup Map`,
      desc: `Find verified startup jobs, engineering, product, and tech roles in ${cityName}, ${stateName}.`,
      path: `/${city.slug}/jobs`,
    },
    events: {
      title: `Startup & Tech Events in ${cityName} | ${cityName} Startup Map`,
      desc: `Discover upcoming hackathons, meetups, pitch days and conferences in ${cityName}, ${stateName}.`,
      path: `/${city.slug}/events`,
    },
    founders: {
      title: `Startup Founders in ${cityName} | ${cityName} Startup Map`,
      desc: `Meet the entrepreneurs, innovators, and leaders building high-growth startups in ${cityName}, ${stateName}.`,
      path: `/${city.slug}/founders`,
    },
    hiring: {
      title: `Startups Hiring in ${cityName} | ${cityName} Startup Map`,
      desc: `Explore top startups actively hiring talent across engineering, sales, and design in ${cityName}, ${stateName}.`,
      path: `/${city.slug}/hiring`,
    },
  };

  const meta = titles[section] || {
    title: `${cityName} Startup Map`,
    desc: `Explore the startup ecosystem in ${cityName}, ${stateName}.`,
    path: `/${city.slug}`,
  };

  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `${SITE.url}${meta.path}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `${SITE.url}${meta.path}`,
    },
  };
}
