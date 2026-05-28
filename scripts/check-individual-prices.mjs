/**
 * Sprawdź individualPrices i productLevels dla produktu id:3
 * Uruchom: node scripts/check-individual-prices.mjs
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

// Czekaj na sync
console.log("Czekam na sync...");
let lastCount = 0, stable = 0;
const deadline = Date.now() + 15 * 60 * 1000;
while (Date.now() < deadline) {
  await page.waitForTimeout(15000);
  const count = await page.evaluate(() => new Promise(resolve => {
    const r = indexedDB.open("TsmDatabase");
    r.onsuccess = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("products")) { db.close(); resolve(0); return; }
      const t = db.transaction("products", "readonly").objectStore("products").count();
      t.onsuccess = ev => { db.close(); resolve(ev.target.result); };
    };
    r.onerror = () => resolve(0);
  }));
  if (count === lastCount && count > 1000) {
    stable++;
    if (stable >= 3) break;
  } else { stable = 0; }
  lastCount = count;
  process.stdout.write(`  products:${count} stable:${stable}/3\r`);
}
console.log(`\nSync done`);

async function readStore(storeName) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await page.evaluate((s) => new Promise((resolve) => {
        const req = indexedDB.open("TsmDatabase");
        req.onerror = () => resolve([]);
        req.onsuccess = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(s)) { db.close(); resolve([]); return; }
          const all = db.transaction(s, "readonly").objectStore(s).getAll();
          all.onsuccess = (ev) => { db.close(); resolve(ev.target.result); };
          all.onerror   = () => { db.close(); resolve([]); };
        };
      }), storeName);
    } catch { await page.waitForTimeout(3000); }
  }
  return [];
}

// 1. individualPricesHeaders — pokaż wszystko (mało rekordów)
console.log("\n=== individualPricesHeaders ===");
const headers = await readStore("individualPricesHeaders");
console.log(`${headers.length} rekordów`);
headers.forEach(h => console.log(JSON.stringify(h)));

// 2. individualPrices — znajdź product 3
console.log("\n=== individualPrices ===");
const ip = await readStore("individualPrices");
console.log(`${ip.length} rekordów łącznie`);
if (ip[0]) console.log("Struktura przykładu:", JSON.stringify(ip[0], null, 2));
const ip3 = ip.filter(r => r.productId === 3 || r.itemId === 3);
if (ip3.length > 0) {
  console.log(`\nDla productId=3:`);
  ip3.forEach(r => console.log(JSON.stringify(r, null, 2)));
} else {
  console.log("Brak wpisu dla productId=3");
  // Pokaż pierwsze 5 rekordów żeby zobaczyć strukturę
  console.log("Pierwsze 5 rekordów:");
  ip.slice(0, 5).forEach(r => console.log(JSON.stringify(r)));
}

// 3. productLevels — znajdź product 3
console.log("\n=== productLevels ===");
const pl = await readStore("productLevels");
console.log(`${pl.length} rekordów łącznie`);
if (pl[0]) console.log("Struktura przykładu:", JSON.stringify(pl[0], null, 2));
const pl3 = pl.filter(r => r.productId === 3 || r.id === 3);
if (pl3.length > 0) {
  console.log(`\nDla productId=3:`);
  pl3.forEach(r => console.log(JSON.stringify(r, null, 2)));
}

// 4. productLevelNames — pokaż wszystko (mało rekordów)
console.log("\n=== productLevelNames ===");
const pln = await readStore("productLevelNames");
console.log(`${pln.length} rekordów`);
pln.forEach(n => console.log(JSON.stringify(n)));

// 5. contractors — pokaż HUBERT (żeby poznać contractorId)
console.log("\n=== contractors ===");
const contractors = await readStore("contractors");
console.log(`${contractors.length} rekordów`);
contractors.forEach(c => console.log(JSON.stringify(c)));

// 6. discounts dla product 3
console.log("\n=== discounts dla productId=3 ===");
const discounts = await readStore("discounts");
const d3 = discounts.filter(d => d.productId === 3);
console.log(`${d3.length} pasujących`);
d3.forEach(d => console.log(JSON.stringify(d)));

await browser.close();
