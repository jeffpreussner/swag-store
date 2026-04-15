import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/cart", "/api/"],
      allow:"/"
    },
    sitemap: `${process.env.BASE_URL || 'https://localhost:3000'}/sitemap.xml`,
  };
}
