import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import FlashSaleBanner from "@/components/home/FlashSaleBanner";
import CartProvider from "@/components/providers/CartProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import SizeQuizModal from "@/components/ui/SizeQuizModal";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const BASE_URL = "https://healingmakers.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "HealingMakers® — Wear Your Heart. Heal the World.",
    template: "%s | HealingMakers®",
  },
  description:
    "HealingMakers is a purpose-driven clothing brand from Lebanon. Every purchase of our hoodies, t-shirts, sweaters, and matching sets directly funds medical donations through @medonations. Custom orders available. Ships worldwide.",
  keywords: [
    // Brand
    "HealingMakers",
    "Healing Makers",
    "HealingMakers Lebanon",
    // Product
    "custom hoodie Lebanon",
    "purpose-driven clothing brand",
    "charity clothing brand",
    "social impact fashion",
    "Lebanese fashion brand",
    "made in Lebanon clothing",
    "matching sets Lebanon",
    "kids clothing Lebanon",
    "custom printed t-shirts",
    "Lebanese streetwear",
    "Beirut fashion brand",
    // Cause
    "medical donation clothing",
    "medonations",
    "clothing that gives back",
    "buy one give one fashion",
    "humanitarian fashion",
    // International reach
    "Lebanese diaspora gifts",
    "Middle East fashion brand",
    "ship worldwide clothing Lebanon",
    // Long-tail AEO
    "what is HealingMakers",
    "HealingMakers reviews",
    "HealingMakers shipping",
    "HealingMakers gift card",
    "HealingMakers custom order",
  ],
  authors: [{ name: "HealingMakers", url: BASE_URL }],
  creator: "HealingMakers",
  publisher: "HealingMakers",
  category: "Fashion & Clothing",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HealingMakers® — Wear Your Heart. Heal the World.",
    description:
      "A purpose-driven clothing brand from Lebanon. Every purchase supports medical donations through @medonations. T-shirts, hoodies, matching sets & custom orders. Ships worldwide.",
    type: "website",
    siteName: "HealingMakers®",
    locale: "en_US",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HealingMakers® — Wear Your Heart, Heal the World. Purpose-driven clothing from Lebanon.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HealingMakers® — Wear Your Heart. Heal the World.",
    description:
      "Purpose-driven clothing from Lebanon supporting medical donations through @medonations. Ships worldwide.",
    images: ["/og-image.jpg"],
    creator: "@healingmakerslb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // GEO — local signals for search engines
    "geo.region": "LB",
    "geo.placename": "Beirut, Lebanon",
    "geo.position": "33.8547;35.8623",
    ICBM: "33.8547, 35.8623",
    // Language
    "DC.language": "en",
    // AEO — hint to AI crawlers
    "DC.description":
      "HealingMakers is a Lebanese clothing brand where every purchase funds medical donations. Products include hoodies, t-shirts, sweaters, matching sets, and kids' clothing. Custom orders available. Ships worldwide.",
    // Entity signals for generative engines
    "article:author": "HealingMakers",
    "og:brand": "HealingMakers",
  },
};

// ─── Structured Data (JSON-LD) ────────────────────────────────────────────────
// Covers: Organization, WebSite, ClothingStore, FAQPage (AEO), BreadcrumbList

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── Organization ──────────────────────────────────────────────────────────
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "HealingMakers",
      alternateName: ["HealingMakers®", "Healing Makers"],
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
      description:
        "HealingMakers is a purpose-driven clothing brand from Beirut, Lebanon. Every purchase directly funds medical donations through the @medonations initiative. Products include hoodies, t-shirts, sweaters, matching sets, kids' clothing, and custom printed apparel. The brand ships worldwide.",
      foundingDate: "2023",
      foundingLocation: {
        "@type": "Place",
        name: "Beirut, Lebanon",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Beirut",
          addressCountry: "LB",
        },
      },
      areaServed: "Worldwide",
      knowsAbout: [
        "Purpose-driven fashion",
        "Custom printed clothing",
        "Medical donations",
        "Lebanese fashion",
        "Sustainable apparel",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+96103786119",
          contactType: "customer service",
          contactOption: "TollFree",
          availableLanguage: ["English", "Arabic", "French"],
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "19:00",
          },
        },
      ],
      sameAs: [
        "https://instagram.com/healingmakerslb",
        `https://wa.me/96103786119`,
      ],
      slogan: "Wear Your Heart. Heal the World.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "HealingMakers Clothing",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Custom Hoodies" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Graphic T-Shirts" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Matching Sets" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kids Clothing" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Gift Cards" } },
        ],
      },
    },

    // ── WebSite (enables SearchBox in Google) ─────────────────────────────────
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "HealingMakers®",
      description: "Shop purpose-driven clothing from Lebanon that funds medical donations.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/shop?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    // ── ClothingStore (local business card) ───────────────────────────────────
    {
      "@type": "ClothingStore",
      "@id": `${BASE_URL}/#store`,
      name: "HealingMakers®",
      url: BASE_URL,
      image: `${BASE_URL}/og-image.jpg`,
      priceRange: "$20 – $100",
      currenciesAccepted: "USD",
      paymentAccepted: "Cash, WhatsApp, Whish Money",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Beirut",
        addressCountry: "LB",
      },
      telephone: "+96103786119",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
        bestRating: "5",
        worstRating: "1",
      },
      servesCuisine: null,
    },

    // ── FAQPage (AEO — answers common questions for AI & featured snippets) ───
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is HealingMakers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HealingMakers is a purpose-driven clothing brand from Beirut, Lebanon. Every purchase funds medical donations through the @medonations initiative. The brand sells hoodies, t-shirts, sweaters, matching sets, kids' clothing, and custom printed apparel.",
          },
        },
        {
          "@type": "Question",
          name: "Does HealingMakers ship internationally?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, HealingMakers ships worldwide. International orders are processed via WhatsApp or the website checkout. Shipping fees and timelines vary by destination.",
          },
        },
        {
          "@type": "Question",
          name: "How do I place a custom order with HealingMakers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Send a WhatsApp message to +961 03 786 119 or use the Contact page on the website. Describe your design, preferred product type, size, and quantity. Custom orders are available for hoodies, t-shirts, and sweaters.",
          },
        },
        {
          "@type": "Question",
          name: "How does HealingMakers support medical donations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HealingMakers partners with @medonations, a Lebanese medical aid initiative. A portion of every purchase is channeled directly to fund medical supplies and support for people in need.",
          },
        },
        {
          "@type": "Question",
          name: "Does HealingMakers have gift cards?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. HealingMakers gift cards are available in various amounts and can be purchased via WhatsApp. Recipient receives a unique code to apply at checkout.",
          },
        },
        {
          "@type": "Question",
          name: "How do I track my HealingMakers order?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Visit healingmakers.com/track-order and enter your order ID (format: HM-XXXXXX). You'll see real-time status updates from processing to delivery.",
          },
        },
        {
          "@type": "Question",
          name: "What sizes does HealingMakers carry?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HealingMakers carries sizes S through XXXL for adults and age-based sizes for kids. Use the Size Quiz on the website to find your perfect fit based on your height, weight, and fit preference.",
          },
        },
        {
          "@type": "Question",
          name: "Can I earn loyalty points at HealingMakers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Every purchase earns 10 loyalty points per $1 spent. No account registration is required — points are saved automatically. Reach 500 points to redeem $5 off a future order.",
          },
        },
      ],
    },

    // ── BreadcrumbList (AEO — helps AI understand site structure) ─────────────
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE_URL}/#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",        item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Shop",        item: `${BASE_URL}/shop` },
        { "@type": "ListItem", position: 3, name: "Reviews",     item: `${BASE_URL}/reviews` },
        { "@type": "ListItem", position: 4, name: "Track Order", item: `${BASE_URL}/track-order` },
        { "@type": "ListItem", position: 5, name: "Gift Cards",  item: `${BASE_URL}/gift-cards` },
        { "@type": "ListItem", position: 6, name: "Contact",     item: `${BASE_URL}/contact` },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${bebasNeue.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#111111" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <ToastProvider>
            <FlashSaleBanner />
            <AnnouncementBar />
            <Navbar />
            <main className="pb-16 lg:pb-0">{children}</main>
            <Footer />
            <WhatsAppButton />
            <MobileBottomNav />
            <SizeQuizModal />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
