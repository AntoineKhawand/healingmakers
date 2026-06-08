import { MetadataRoute } from "next";

const BASE = "https://healingmakers.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/customize`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/shop/t-shirts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/shop/hoodies`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/shop/sweaters`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/shop/matching-sets`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/shop/kids`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/cause`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.65 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/size-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/track-order`, lastModified: now, changeFrequency: "monthly", priority: 0.45 },
    { url: `${BASE}/policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
