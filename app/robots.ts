import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/checkout/", "/cart/", "/api/", "/order-confirmation/"],
      },
    ],
    sitemap: "https://healingmakers.com/sitemap.xml",
  };
}
