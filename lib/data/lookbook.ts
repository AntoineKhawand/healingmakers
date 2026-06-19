export interface LookbookEntry {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productSlugs: string[];
  productNames: string[];
  season: string;
}

export const lookbookEntries: LookbookEntry[] = [
  {
    id: "look-1",
    title: "The Everyday Essential",
    subtitle: "Clean. Minimal. Lebanese.",
    image: "/products/joie-de-vivre-tshirt.webp",
    productSlugs: ["be-kind-tshirt", "joie-de-vivre-tshirt", "less-fear-more-love-tshirt"],
    productNames: ["Be Kind", "Joie de Vivre", "Less Fear, More Love"],
    season: "Summer 2026",
  },
  {
    id: "look-2",
    title: "The Comfort Set",
    subtitle: "Made to be worn all day, every day.",
    image: "/products/matching-set.webp",
    productSlugs: ["healingmakers-matching-set", "many-fest-more-love-matching-set"],
    productNames: ["HealingMakers Matching Hoodie Set", "Many Fest More Love Matching Hoodie"],
    season: "Summer 2026",
  },
  {
    id: "look-3",
    title: "The Statement Hoodie",
    subtitle: "Wear your values. Literally.",
    image: "/products/be-a-kind-human-hoodie.webp",
    productSlugs: ["be-a-kind-human-hoodie", "trust-in-the-lord-hoodie", "your-potential-is-endless-hoodie"],
    productNames: ["Be a Kind Human", "Trust in the Lord", "Your Potential Is Endless"],
    season: "Summer 2026",
  },
  {
    id: "look-4",
    title: "The Kids Edit",
    subtitle: "Because healing starts young.",
    image: "/products/just-a-girl-kids-hoodie.webp",
    productSlugs: ["just-a-girl-kids-hoodie", "official-cookies-tester-kids-hoodie", "be-a-little-naughty-kids-hoodie"],
    productNames: ["Just a Girl", "Official Cookies Tester", "Sometimes You Have to Be a Little Bit Naughty"],
    season: "Summer 2026",
  },
  {
    id: "look-5",
    title: "Layer Season",
    subtitle: "Sweater weather, all year.",
    image: "/products/wellness-sweater.webp",
    productSlugs: ["wellness-sweater", "stronger-than-the-storm-sweater", "remember-your-why-sweater"],
    productNames: ["Wellness", "Stronger than the Storm", "Remember Your Why"],
    season: "Summer 2026",
  },
  {
    id: "look-6",
    title: "The Custom Piece",
    subtitle: "Your name. Your story.",
    image: "/products/love-speaks-every-language-tshirt-first-slide.webp",
    productSlugs: ["love-speaks-every-language-tshirt", "we-rise-by-lifting-others-tshirt"],
    productNames: ["Love Speaks Every Language", "We Rise By Lifting Others"],
    season: "Summer 2026",
  },
];
