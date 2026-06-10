import dynamic from "next/dynamic";

const CustomizePageClient = dynamic(() => import("@/components/customize/CustomizePageClient"), { ssr: false });

export const metadata = {
  title: "Customize",
  description: "Create your custom HealingMakers piece. Add your name, date, or message.",
  alternates: { canonical: "/customize" },
};

export default function CustomizePage() {
  return <CustomizePageClient />;
}
