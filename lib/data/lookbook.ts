export interface LookbookEntry {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  zoom?: boolean;
  productSlugs: string[];
  productNames: string[];
  season: string;
}

export const lookbookEntries: LookbookEntry[] = [
  {
    id: "look-1",
    title: "The Everyday Essential",
    subtitle: "Clean. Minimal. Lebanese.",
    image: "https://images.unsplash.com/photo-1624373607006-348f61ea2d76?w=900&q=80",
    zoom: true,
    productSlugs: ["be-kind-tshirt", "joie-de-vivre-tshirt", "less-fear-more-love-tshirt"],
    productNames: ["Be Kind", "Joie de Vivre", "Less Fear, More Love"],
    season: "Summer 2026",
  },
  {
    id: "look-2",
    title: "The Comfort Set",
    subtitle: "Made to be worn all day, every day.",
    image: "https://images.unsplash.com/photo-1635796244808-d93b6e26de62?w=900&q=80",
    zoom: true,
    productSlugs: ["healingmakers-matching-set", "many-fest-more-love-matching-set"],
    productNames: ["HealingMakers Matching Hoodie Set", "Many Fest More Love Matching Hoodie"],
    season: "Summer 2026",
  },
  {
    id: "look-3",
    title: "The Statement Hoodie",
    subtitle: "Wear your values. Literally.",
    image: "https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=900&q=80",
    zoom: true,
    productSlugs: ["be-a-kind-human-hoodie", "trust-in-the-lord-hoodie", "your-potential-is-endless-hoodie"],
    productNames: ["Be a Kind Human", "Trust in the Lord", "Your Potential Is Endless"],
    season: "Summer 2026",
  },
  {
    id: "look-4",
    title: "The Kids Edit",
    subtitle: "Because healing starts young.",
    image: "https://images.unsplash.com/photo-1754639488181-7eae9f6c06e0?w=900&q=80",
    zoom: true,
    productSlugs: ["just-a-girl-kids-hoodie", "official-cookies-tester-kids-hoodie", "be-a-little-naughty-kids-hoodie"],
    productNames: ["Just a Girl", "Official Cookies Tester", "Sometimes You Have to Be a Little Bit Naughty"],
    season: "Summer 2026",
  },
  {
    id: "look-5",
    title: "Layer Season",
    subtitle: "Sweater weather, all year.",
    image: "https://images.unsplash.com/photo-1616006897093-5e4635c0de35?w=900&q=80",
    productSlugs: ["wellness-sweater", "stronger-than-the-storm-sweater", "remember-your-why-sweater"],
    productNames: ["Wellness", "Stronger than the Storm", "Remember Your Why"],
    season: "Summer 2026",
  },
  {
    id: "look-6",
    title: "The Custom Piece",
    subtitle: "Your name. Your story.",
    image: "https://images.unsplash.com/photo-1593726891090-b4c6bc09c819?w=900&q=80",
    zoom: true,
    productSlugs: ["love-speaks-every-language-tshirt", "we-rise-by-lifting-others-tshirt"],
    productNames: ["Love Speaks Every Language", "We Rise By Lifting Others"],
    season: "Summer 2026",
  },
];
