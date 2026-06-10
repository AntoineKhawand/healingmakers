import { MetadataRoute } from "next";
import { products } from "@/lib/data/products";

const BASE = "https://healingmakerslb.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/customize`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/shop/t-shirts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/shop/hoodies`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/shop/sweaters`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/shop/matching-sets`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/shop/kids`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/drops`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/bundle`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/lookbook`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/gift-cards`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/cause`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.65 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/size-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/track-order`, lastModified: now, changeFrequency: "monthly", priority: 0.45 },
    { url: `${BASE}/policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
