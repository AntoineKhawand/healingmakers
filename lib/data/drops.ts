export interface Drop {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  dropDate: string; // ISO 8601
  price: number;
  category: string;
  isLive: boolean;
  isSoldOut: boolean;
  pieces: number;
}

export const drops: Drop[] = [
  {
    id: "drop-summer-2026",
    name: "Summer Drop 2026",
    tagline: "Lebanese Heat. Global Style.",
    description:
      "Washed linens, heavyweight tees, and a palette pulled straight from a Beirut summer. Limited to 120 pieces total.",
    coverImage:
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1200&q=80",
    dropDate: "2026-06-10T18:00:00+03:00",
    price: 59,
    category: "t-shirts",
    isLive: false,
    isSoldOut: false,
    pieces: 120,
  },
  {
    id: "drop-medonations-collab",
    name: "The Healing Collab",
    tagline: "HealingMakers × @medonations",
    description:
      "Our first official collaboration piece. Every unit sold covers one full month of medications for a Lebanese family.",
    coverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    dropDate: "2026-06-20T18:00:00+03:00",
    price: 75,
    category: "hoodies",
    isLive: false,
    isSoldOut: false,
    pieces: 80,
  },
  {
    id: "drop-eid-collection",
    name: "Eid Special",
    tagline: "Dressed for celebration.",
    description:
      "Matching sets in ivory and gold, designed for the holiday season. Comes in a limited-edition gift box.",
    coverImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
    dropDate: "2026-07-01T10:00:00+03:00",
    price: 110,
    category: "matching-sets",
    isLive: false,
    isSoldOut: false,
    pieces: 60,
  },
];
