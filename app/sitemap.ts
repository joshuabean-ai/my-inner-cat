import type { MetadataRoute } from "next";
import { cats, toSlug } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const results: MetadataRoute.Sitemap = cats.map((c) => ({
    url: `${SITE_URL}/result/${toSlug(c.archetype)}/${toSlug(c.id)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.8 },
    ...results,
  ];
}
