import FAQPageClient from "./FaqClient";

export const metadata = {
  title: "FAQ",
  description: "Answers to frequently asked questions about shipping, custom orders, payments, sizing, returns, and how every purchase supports @medonations.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return <FAQPageClient />;
}
