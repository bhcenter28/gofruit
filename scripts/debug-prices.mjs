/**
 * Debug: pokaż wszystkie pola cenowe dla "3 BIT BATON 46G"
 * Uruchom: node scripts/debug-prices.mjs
 */
import { chromium } from "playwright";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";

const browser = await chromium.launch({ headless: false });
const page = await (await browser.newContext()).newPage();

await page.goto(BASE + "/web/login", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
if (await page.$("input[type=password]")) {
  const u = await page.$("input[type=text], input[name*=user]");
  if (u) await u.fill(LOGIN);
  await page.fill("input[type=password]", PASS);
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(5000);
}

async function readStore(storeName) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await page.evaluate((s) => {
        return new Promise((resolve) => {
          const req = indexedDB.open("TsmDatabase");
          req.onerror = () => resolve([]);
          req.onsuccess = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(s)) { db.close(); resolve([]); return; }
            const all = db.transaction(s, "readonly").objectStore(s).getAll();
            all.onsuccess = (ev) => { db.close(); resolve(ev.target.result); };
            all.onerror   = () => { db.close(); resolve([]); };
          };
        });
      }, storeName);
    } catch {
      await page.waitForTimeout(3000);
    }
  }
  return [];
}

// Czekaj na sync
console.log("Czekam na sync...");
let products = [], lastCount = 0, stable = 0;
const deadline = Date.now() + 15 * 60 * 1000;
while (Date.now() < deadline) {
  await page.waitForTimeout(15000);
  products = await readStore("products");
  if (products.length === lastCount && products.length > 1000) {
    stable++;
    if (stable >= 3) break;
  } else { stable = 0; }
  lastCount = products.length;
  process.stdout.write(`  products:${products.length} stable:${stable}/3\r`);
}
console.log(`\nSync done: ${products.length} products`);

// Znajdź "3 BIT BATON 46G" i pokaż wszystkie pola cenowe
const target = products.find(p => p.name && p.name.includes("3 BIT BATON"));
if (target) {
  console.log("\n=== 3 BIT BATON 46G ===");
  console.log("id:", target.id);
  console.log("name:", target.name);
  const priceFields = Object.keys(target).filter(k => k.toLowerCase().includes("price"));
  for (const f of priceFields) {
    console.log(`  ${f}: ${target[f]}`);
  }
  console.log("\nWszystkie pola:");
  console.log(JSON.stringify(target, null, 2));
} else {
  console.log("Nie znaleziono produktu! Szukam podobnych...");
  const similar = products.filter(p => p.name && p.name.toLowerCase().includes("bit")).slice(0, 5);
  similar.forEach(p => console.log(`  id:${p.id} name:${p.name} price:${p.price} priceD:${p.priceD}`));
}

// Pokaż też pierwsze 3 produkty z cenami dla porównania
console.log("\n=== Pierwsze 3 produkty z ceną ===");
products.filter(p => p.price > 0).slice(0, 3).forEach(p => {
  const priceFields = Object.keys(p).filter(k => k.toLowerCase().includes("price"));
  const prices = priceFields.map(f => `${f}:${p[f]}`).join(" | ");
  console.log(`  ${p.name} → ${prices}`);
});

await browser.close();
