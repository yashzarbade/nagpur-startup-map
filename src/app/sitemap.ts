import type { MetadataRoute } from "next";
import { SITE, SECTORS } from "@/lib/constants";
import {
  getAllCompanies,
  getAllJobs,
  getAllEvents,
  getAllFounders,
  getAllTalent,
} from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/startups`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/founders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hiring`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/talent`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/startups/all`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/advertise`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Sector pages
  const sectorPages: MetadataRoute.Sitemap = SECTORS.filter(
    (s) => s.slug !== "other"
  ).map((sector) => ({
    url: `${baseUrl}/startups/${sector.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Entity pages
  const companyPages: MetadataRoute.Sitemap = getAllCompanies().map((c) => ({
    url: `${baseUrl}/company/${c.slug}`,
    lastModified: new Date(c.lastVerifiedAt || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const jobPages: MetadataRoute.Sitemap = getAllJobs().map((j) => ({
    url: `${baseUrl}/job/${j.slug}`,
    lastModified: new Date(j.postedAt),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = getAllEvents().map((e) => ({
    url: `${baseUrl}/event/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const founderPages: MetadataRoute.Sitemap = getAllFounders().map((f) => ({
    url: `${baseUrl}/founder/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const talentPages: MetadataRoute.Sitemap = getAllTalent().map((t) => ({
    url: `${baseUrl}/talent/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const areaSlugs = ["mihan", "it-park", "dharampeth", "civil-lines", "sadar", "wardha-road", "pratap-nagar", "laxmi-nagar"];
  const areaPages: MetadataRoute.Sitemap = areaSlugs.map((slug) => ({
    url: `${baseUrl}/areas/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...sectorPages,
    ...companyPages,
    ...jobPages,
    ...eventPages,
    ...founderPages,
    ...talentPages,
    ...areaPages,
  ];
}
