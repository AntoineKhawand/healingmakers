import { notFound } from "next/navigation";
import Script from "next/script";
import { getProductBySlug, products } from "@/lib/data/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";

const BASE_URL = "https://healingmakerslb.com";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} | HealingMakers®`,
      description: product.description,
      type: "website",
      siteName: "HealingMakers®",
      locale: "en_US",
      url: `/product/${product.slug}`,
      images: product.images.map((img) => ({ url: img, alt: product.name })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | HealingMakers®`,
      description: product.description,
      images: product.images,
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => `${BASE_URL}${img}`),
    sku: product.id,
    brand: { "@type": "Brand", name: "HealingMakers" },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  return (
    <>
      <Script
        id="product-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
