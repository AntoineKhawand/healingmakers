import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/admin/", "/checkout/", "/cart/", "/api/", "/order-confirmation/"],
      },
    ],
    sitemap: "https://healingmakerslb.com/sitemap.xml",
  };
}
