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
    image: "https://images.unsplash.com/photo-1520975867593-62d5a83b90dc?w=900&q=80",
    productSlugs: ["healingmakers-classic-tee", "healingmakers-oversized-hoodie"],
    productNames: ["HM Classic Tee", "Oversized Hoodie"],
    season: "Summer 2026",
  },
  {
    id: "look-2",
    title: "The Comfort Set",
    subtitle: "Made to be worn all day, every day.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80",
    productSlugs: ["healingmakers-matching-set-grey", "healingmakers-classic-tee"],
    productNames: ["Matching Set — Grey", "HM Classic Tee"],
    season: "Summer 2026",
  },
  {
    id: "look-3",
    title: "The Statement Hoodie",
    subtitle: "Wear your values. Literally.",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=900&q=80",
    productSlugs: ["healingmakers-oversized-hoodie"],
    productNames: ["Oversized Hoodie — Black"],
    season: "Summer 2026",
  },
  {
    id: "look-4",
    title: "The Kids Edit",
    subtitle: "Because healing starts young.",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=900&q=80",
    productSlugs: ["healingmakers-kids-set"],
    productNames: ["Kids Mini Set"],
    season: "Summer 2026",
  },
  {
    id: "look-5",
    title: "Layer Season",
    subtitle: "Sweater weather, all year.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80",
    productSlugs: ["healingmakers-crewneck-sweater"],
    productNames: ["HM Crewneck Sweater"],
    season: "Summer 2026",
  },
  {
    id: "look-6",
    title: "The Custom Piece",
    subtitle: "Your name. Your story.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    productSlugs: ["healingmakers-custom-tee"],
    productNames: ["Custom Embroidered Tee"],
    season: "Summer 2026",
  },
];
