/**
 * Instagram scraper using Playwright.
 * Dismisses the login modal, then grabs post grid images directly from the page.
 *
 * Usage (no login — public posts only):
 *   node scripts/scrape-instagram.js
 *
 * Usage (with login — gets more posts):
 *   INSTAGRAM_USER=you@email.com INSTAGRAM_PASS=yourpassword node scripts/scrape-instagram.js
 *
 * Output: public/instagram/post-1.jpg … post-N.jpg  +  scripts/instagram-posts.json
 */

const { chromium } = require("playwright");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const IG_URL = "https://www.instagram.com/healingmakerslb/";
const OUT_DIR = path.join(__dirname, "..", "public", "instagram");
const JSON_OUT = path.join(__dirname, "instagram-posts.json");
const MAX_POSTS = 12;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    const req = client.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.instagram.com/" } },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close(() => fs.unlinkSync(dest));
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      }
    );
    req.on("error", (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

async function login(page) {
  const user = process.env.INSTAGRAM_USER;
  const pass = process.env.INSTAGRAM_PASS;
  if (!user || !pass) return false;

  console.log("🔐 Logging in…");
  await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  // Dismiss cookie banner
  await page.locator('button:has-text("Allow"), button:has-text("Accept")').first().click({ timeout: 3000 }).catch(() => {});

  await page.fill('input[name="username"]', user);
  await page.fill('input[name="password"]', pass);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  await page.locator('button:has-text("Not now"), button:has-text("Not Now")').first().click({ timeout: 4000 }).catch(() => {});
  return true;
}

async function main() {
  console.log("🚀 Scraping @healingmakerslb with Playwright…\n");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 900 },
    locale: "en-US",
  });

  // Intercept image responses to capture highest-res URLs
  const capturedImages = new Map();
  context.on("response", async (response) => {
    const url = response.url();
    if (
      url.includes("fbcdn.net") &&
      (url.includes("_n.jpg") || url.includes("_n.webp")) &&
      !url.includes("s150x150") &&
      !url.includes("profile_pic")
    ) {
      const status = response.status();
      if (status === 200) {
        capturedImages.set(url, true);
      }
    }
  });

  const page = await context.newPage();

  // Try login if credentials given
  if (process.env.INSTAGRAM_USER) {
    await login(page);
  }

  console.log("📸 Loading @healingmakerslb profile…");
  await page.goto(IG_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);

  // ── Dismiss the "See photos" / login-prompt modal ────────────────────────
  const closeBtn = page.locator('svg[aria-label="Close"], button[aria-label="Close"], div[role="button"] svg').first();
  await closeBtn.click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // Also try pressing Escape to dismiss
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1000);

  // Debug screenshot after modal dismissal
  await page.screenshot({ path: path.join(OUT_DIR, "_debug_after_modal.png") });
  console.log("📷 Screenshot saved: public/instagram/_debug_after_modal.png\n");

  // ── Scroll to trigger lazy-load of post grid ────────────────────────────
  console.log("📜 Scrolling to load post grid…");
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);
  }

  // ── Extract post grid images ─────────────────────────────────────────────
  // Target <a href="/p/..."> anchors (actual posts), get their img src
  const postImages = await page.evaluate(() => {
    const results = [];
    const seen = new Set();

    // Method 1: post anchors (/p/ links)
    document.querySelectorAll('a[href*="/p/"]').forEach((anchor) => {
      const img = anchor.querySelector("img");
      if (!img) return;
      const src = img.src || img.getAttribute("src") || "";
      const srcset = img.srcset || img.getAttribute("srcset") || "";
      if (!src || seen.has(src)) return;
      seen.add(src);

      // Try to pick highest-res from srcset
      let bestSrc = src;
      if (srcset) {
        const parts = srcset.split(",").map((s) => s.trim().split(" "));
        const sorted = parts.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
        if (sorted[0] && sorted[0][0]) bestSrc = sorted[0][0];
      }

      results.push({
        src: bestSrc,
        fallback: src,
        alt: img.alt || "",
        href: anchor.href,
      });
    });

    // Method 2: fallback — any img inside the main grid that looks like a post
    if (results.length === 0) {
      document.querySelectorAll("main img, article img").forEach((img) => {
        const src = img.src || "";
        if (!src || seen.has(src)) return;
        if (img.naturalWidth < 100 || src.includes("profile_pic")) return;
        seen.add(src);
        results.push({ src, fallback: src, alt: img.alt || "", href: "" });
      });
    }

    return results;
  });

  // Also include network-captured full-res images
  const networkUrls = Array.from(capturedImages.keys());
  console.log(`   Network captured: ${networkUrls.length} full-res image URLs`);
  console.log(`   DOM extracted:    ${postImages.length} post images\n`);

  // Prefer network-captured full-res where we have them
  const finalList = [];
  if (networkUrls.length > 0) {
    for (const url of networkUrls.slice(0, MAX_POSTS)) {
      finalList.push({ src: url, alt: "HealingMakers post", href: "" });
    }
  } else {
    finalList.push(...postImages.slice(0, MAX_POSTS));
  }

  if (finalList.length === 0) {
    console.error(
      "❌ No post images found.\n" +
        "   Instagram is blocking headless access to the grid.\n" +
        "   Try logging in:\n" +
        "   INSTAGRAM_USER=you@email.com INSTAGRAM_PASS=password node scripts/scrape-instagram.js\n"
    );
    await browser.close();
    process.exit(1);
  }

  // ── Download images ──────────────────────────────────────────────────────
  const posts = [];
  for (let i = 0; i < finalList.length; i++) {
    const item = finalList[i];
    const filename = `post-${i + 1}.jpg`;
    const dest = path.join(OUT_DIR, filename);
    const urlToTry = item.src;

    try {
      await download(urlToTry, dest);
      const stats = fs.statSync(dest);
      console.log(`  ✅ post-${i + 1}.jpg  (${Math.round(stats.size / 1024)} KB)`);
      posts.push({ local: `/instagram/${filename}`, alt: item.alt || `HealingMakers post ${i + 1}` });
    } catch (err) {
      // Fallback to DOM src
      if (item.fallback && item.fallback !== item.src) {
        try {
          await download(item.fallback, dest);
          console.log(`  ✅ post-${i + 1}.jpg  (fallback)`);
          posts.push({ local: `/instagram/${filename}`, alt: item.alt || `HealingMakers post ${i + 1}` });
        } catch {
          console.warn(`  ⚠️  Skipped post-${i + 1}: download failed`);
        }
      } else {
        console.warn(`  ⚠️  Skipped post-${i + 1}: ${err.message}`);
      }
    }
  }

  fs.writeFileSync(JSON_OUT, JSON.stringify(posts, null, 2));

  console.log(`\n✅ Saved ${posts.length} post images to public/instagram/`);
  console.log(`📄 Manifest: scripts/instagram-posts.json\n`);

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
