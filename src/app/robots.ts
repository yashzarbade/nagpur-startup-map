import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/account",
          "/account/*",
          "/login",
          "/api",
          "/api/*",
          "/internal",
          "/internal/*",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
