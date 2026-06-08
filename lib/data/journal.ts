export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  authorAvatar: string;
  category: "Story" | "Style" | "Cause" | "Behind the Scenes" | "Drop";
  readTime: number;
  publishedAt: string;
  content: string;
}

export const journalPosts: JournalPost[] = [
  {
    slug: "why-we-started-healingmakers",
    title: "Why We Started HealingMakers",
    excerpt: "A brand born in crisis. Here's the real story behind the name, the mission, and why every stitch matters.",
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    author: "The HealingMakers Team",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",
    category: "Story",
    readTime: 5,
    publishedAt: "2026-05-10",
    content: `Lebanon wasn't supposed to be a fashion capital. But when the 2020 explosion shook Beirut and the country's medical system buckled under the weight of crisis after crisis, a small group of friends decided that waiting wasn't an option.

We had skills — design, sewing, sourcing — and we had a partner in @medonations who could turn donations into real medicine reaching real families. So we asked: what if clothing could be the vehicle?

That's how HealingMakers was born. Not as a fashion brand chasing trends, but as a mechanism — a way to turn something people already buy (clothes) into something that saves lives (medicine).

Every hoodie, every tee, every matching set you order directly funds a prescription. When you wear HealingMakers, you're wearing someone else's second chance.

We design in Lebanon. We stitch in Lebanon. We donate in Lebanon. And we plan to keep doing it, one garment at a time, until the country is back on its feet.

Thank you for being part of this.`,
  },
  {
    slug: "how-medonations-works",
    title: "How @medonations Turns Your Purchase Into Medicine",
    excerpt: "The full chain from your checkout to a prescription in someone's hands — transparent, traceable, real.",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    author: "The HealingMakers Team",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",
    category: "Cause",
    readTime: 4,
    publishedAt: "2026-05-18",
    content: `You place an order. We make your garment. A portion of every sale goes directly to @medonations — our official medical donation partner.

Here's what happens next:

**1. We transfer funds**
At the end of each month, we calculate our donation pool from all completed orders and wire it directly to @medonations' verified account.

**2. @medonations procures medicine**
They source medications — chronic disease drugs, pediatric treatments, surgical supplies — at bulk rates through their vetted network of suppliers.

**3. Distribution to families**
Working with hospitals, clinics, and community centers across Lebanon, they ensure medications reach the people who can't otherwise afford them.

**4. You see the impact**
We update our impact counter on the website and share stories on Instagram every quarter. You helped make those numbers real.

We've funded 500+ individual medication donations since we launched. Every number represents a person. That's the deal — you wear it, they heal.`,
  },
  {
    slug: "how-to-style-an-oversized-hoodie",
    title: "5 Ways to Style Our Oversized Hoodie",
    excerpt: "From street to casual-chic — styling tips straight from the Beirut community who wear it best.",
    coverImage: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=1200&q=80",
    author: "Lara K.",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&fit=crop&crop=face",
    category: "Style",
    readTime: 3,
    publishedAt: "2026-05-25",
    content: `The HealingMakers oversized hoodie is our most-ordered piece — and for good reason. It's soft, heavy, and has that lived-in quality that makes every outfit feel intentional.

Here are 5 ways the community has been styling it:

**1. The Half-Tuck**
Tuck just the front into high-waisted jeans. Add white sneakers. Done.

**2. The Layered Look**
Throw a longline coat over it. Looks like you planned it. You didn't.

**3. Matching Set**
Pair it with the matching sweatpants for a monochrome moment. It's our most photographed combo on Instagram.

**4. Dress It Up**
Yes, it sounds wrong. But a structured blazer over the hoodie with tailored trousers actually works. Try it.

**5. The Classic**
Hoodie. Straight-leg jeans. Chunky sneakers. Timeless. Effortless. Lebanese street energy.

Tag us @healingmakerslb when you find your version — we might feature you in the next drop campaign.`,
  },
  {
    slug: "summer-drop-2026-behind-scenes",
    title: "Behind the Seams: Summer Drop 2026",
    excerpt: "We took cameras into the workshop. Here's what making a HealingMakers drop actually looks like.",
    coverImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
    author: "The HealingMakers Team",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",
    category: "Behind the Scenes",
    readTime: 4,
    publishedAt: "2026-06-01",
    content: `Every HealingMakers drop starts the same way: a mood board on the wall of our Beirut studio, three people arguing about color, and strong coffee.

The Summer 2026 collection began in February. We were obsessed with the idea of "Lebanese summer energy" — that particular heat and color and chaos that anyone who's spent a summer in the country knows in their bones.

We settled on a palette of washed whites, warm terracotta tones, and our signature reds. The fabrics came from local suppliers in the Ashrafieh district — every piece of fabric we use is sourced within Lebanon.

The embroidery team came next. For this drop, we added hand-finished details to the collar and cuff of the heavyweight tees — a small touch that takes 20 extra minutes per garment but makes them completely distinctive.

Photography was shot on a rooftop in Mar Mikhael on a particularly golden afternoon. The models are all members of our community — customers who became friends who became the face of the brand.

We're proud of this one. We think you will be too.`,
  },
  {
    slug: "custom-order-guide",
    title: "The Complete Guide to Custom Orders",
    excerpt: "Exactly how to order a custom piece — what's possible, what's not, timelines, and how to get it perfect.",
    coverImage: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&q=80",
    author: "The HealingMakers Team",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",
    category: "Style",
    readTime: 5,
    publishedAt: "2026-06-03",
    content: `Custom orders are one of our most popular offerings — and also the most misunderstood. Here's exactly how they work.

**What you can customize:**
- Text on front, back, sleeve, or collar
- Names, dates, phrases, quotes
- Placement: center chest, left chest, back upper, back lower
- Color of text/embroidery (we offer 12 standard colors)
- Font style (block, script, or our signature HM display font)

**What we can't do:**
- Complex illustrations or logos (for that, use our Customize page to upload artwork)
- Metallic finishes on kids' sizes
- Rush orders for custom pieces during drop weeks (we're at capacity)

**Timeline:**
Standard custom orders take 7–10 business days from confirmation. Complex embroidery may take up to 14 days. You'll get a WhatsApp update when your piece enters production and again when it ships.

**How to order:**
1. Add the base product to your cart
2. Fill in the custom text field on the product page
3. Complete checkout — or message us on WhatsApp if your request is complex
4. We'll send you a proof before we start stitching

Questions? We're always reachable at wa.me/96103786119.`,
  },
];
