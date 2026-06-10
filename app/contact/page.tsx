import ContactPageClient from "./ContactClient";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with HealingMakers via WhatsApp, Instagram, or email. We reply within 2 hours during business hours (Mon–Sat, Beirut time).",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
