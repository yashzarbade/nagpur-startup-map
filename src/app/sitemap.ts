import type { MetadataRoute } from "next";
import { SITE, SECTORS } from "@/lib/constants";
import { getAllPublishedCities, getCityAreas } from "@/lib/cities";
import {
  getAllCompanies,
  getAllEvents,
  getAllFounders,
  getAllTalent,
} from "@/lib/data";
import { getAllCompanySlugs } from "@/lib/queries/companies";
import { getActiveJobSlugs } from "@/lib/queries/jobs";
import { getWalkins } from "@/lib/queries/walkins";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url;

  // Root platform pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
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
    {
      url: `${baseUrl}/walkins`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/walkins/nagpur`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/walkins/indore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/walkins/bhopal`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/submit/walkin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic pages for all published cities ONLY (strictly excluding unpublished cities)
  const publishedCities = await getAllPublishedCities();
  const cityPages: MetadataRoute.Sitemap = [];

  for (const city of publishedCities) {
    // City Hub
    cityPages.push({
      url: `${baseUrl}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    });

    // City Subsections
    cityPages.push(
      {
        url: `${baseUrl}/${city.slug}/startups`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/${city.slug}/jobs`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/${city.slug}/events`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${city.slug}/founders`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/${city.slug}/hiring`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }
    );

    // City Sector Pages
    SECTORS.filter((s) => s.slug !== "other").forEach((sector) => {
      cityPages.push({
        url: `${baseUrl}/${city.slug}/startups/${sector.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    });

    // City Area Pages
    const areas = getCityAreas(city.slug);
    areas.forEach((area) => {
      cityPages.push({
        url: `${baseUrl}/${city.slug}/areas/${area.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    // City Role Pages
    const commonRoles = [
      "software-engineer",
      "frontend-engineer",
      "backend-engineer",
      "full-stack-engineer",
      "ai-ml-engineer",
      "product-manager",
      "sales-bd",
      "internship",
    ];
    commonRoles.forEach((role) => {
      cityPages.push({
        url: `${baseUrl}/${city.slug}/jobs/${role}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    });
  }

  // Entity pages (database-backed dynamic company slugs across Nagpur, Indore, Bhopal)
  const allCompanySlugs = await getAllCompanySlugs();
  const companyPages: MetadataRoute.Sitemap = allCompanySlugs.map((c) => {
    const citySlug = c.cityId === 3 ? "indore" : c.cityId === 6 ? "bhopal" : "nagpur";
    return {
      url: `${baseUrl}/${citySlug}/company/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  // Jobs: only active jobs
  const activeJobs = await getActiveJobSlugs();
  const jobPages: MetadataRoute.Sitemap = activeJobs.map((j: any) => {
    const citySlug = (j as any).cityId === 3 ? "indore" : (j as any).cityId === 6 ? "bhopal" : "nagpur";
    return {
      url: `${baseUrl}/${citySlug}/job/${j.slug}`,
      lastModified: new Date(j.postedAt),
      changeFrequency: "daily" as const,
      priority: 0.7,
    };
  });

  // Events: only upcoming verified events
  const eventPages: MetadataRoute.Sitemap = getAllEvents()
    .filter((e) => e.status === "UPCOMING" && new Date(e.date) >= new Date())
    .map((e) => {
      const citySlug = (e as any).cityId === 3 || e.location?.includes("Indore") || e.venue?.includes("Indore") ? "indore" : (e as any).cityId === 6 || e.location?.includes("Bhopal") ? "bhopal" : "nagpur";
      return {
        url: `${baseUrl}/${citySlug}/event/${e.slug}`,
        lastModified: new Date(e.date),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    });

  const { walkins: activeWalkins } = await getWalkins({ freshness: "upcoming" });
  const walkinPages: MetadataRoute.Sitemap = activeWalkins.map((w) => ({
    url: `${baseUrl}/walkins/${w.slug}`,
    lastModified: new Date(w.walkinDate),
    changeFrequency: "daily" as const,
    priority: 0.8,
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

  return [
    ...staticPages,
    ...cityPages,
    ...companyPages,
    ...jobPages,
    ...walkinPages,
    ...eventPages,
    ...founderPages,
    ...talentPages,
  ];
}
