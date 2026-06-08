import dynamic from "next/dynamic";

const CustomizePageClient = dynamic(() => import("@/components/customize/CustomizePageClient"), { ssr: false });

export const metadata = {
  title: "Customize — HealingMakers®",
  description: "Create your custom HealingMakers piece. Add your name, date, or message.",
};

export default function CustomizePage() {
  return <CustomizePageClient />;
}
