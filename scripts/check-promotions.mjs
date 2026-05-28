/**
 * Sprawdź promotions dla produktu id:3 (3 BIT BATON, promotionId:7399)
 * Uruchom: node scripts/check-promotions.mjs
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

// 1. Promotions — znajdź id 7399
console.log("\n=== promotions ===");
const promotions = await readStore("promotions");
console.log(`${promotions.length} rekordów`);
const p7399 = promotions.find(p => p.id === 7399 || p.rowId === 7399 || p.promotionId === 7399);
if (p7399) {
  console.log("Promocja 7399:");
  console.log(JSON.stringify(p7399, null, 2));
} else {
  console.log("Brak promocji 7399. Pierwsze 3 przykłady:");
  promotions.slice(0, 3).forEach(p => console.log(JSON.stringify(p, null, 2)));
}

// 2. contractorPromotions — pokaż wszystko
console.log("\n=== contractorPromotions ===");
const cp = await readStore("contractorPromotions");
console.log(`${cp.length} rekordów`);
cp.forEach(c => console.log(JSON.stringify(c, null, 2)));

// 3. productPromotions — znajdź product 3
console.log("\n=== productPromotions dla productId=3 ===");
const pp = await readStore("productPromotions");
const pp3 = pp.filter(r => r.productId === 3);
console.log(`${pp3.length} rekordów dla product 3`);
pp3.forEach(r => console.log(JSON.stringify(r, null, 2)));

// 4. discounts — szukaj po groupId=2 lub manufacturerId=2 (grupy produktu 3)
console.log("\n=== discounts dla groupId=2 lub manufacturerId=2 ===");
const discounts = await readStore("discounts");
const dg2 = discounts.filter(d => d.groupId === 2 || d.manufacturerId === 2);
console.log(`${dg2.length} pasujących`);
dg2.slice(0, 10).forEach(d => console.log(JSON.stringify(d)));
// Pokaż też strukturę discounts
if (discounts[0]) console.log("\nStruktura discounts:", JSON.stringify(discounts[0], null, 2));

// 5. currencyPrices — sprawdź strukturę i product 3
console.log("\n=== currencyPrices ===");
const cp2 = await readStore("currencyPrices");
console.log(`${cp2.length} rekordów`);
if (cp2[0]) {
  console.log("Struktura:", JSON.stringify(cp2[0], null, 2));
  const cp3 = cp2.filter(r => r.productId === 3);
  console.log(`Dla productId=3: ${cp3.length} rekordów`);
  cp3.forEach(r => console.log(JSON.stringify(r)));
}

// 6. secondLevelMargins
console.log("\n=== secondLevelMargins ===");
const slm = await readStore("secondLevelMargins");
console.log(`${slm.length} rekordów`);
slm.slice(0, 5).forEach(r => console.log(JSON.stringify(r)));

await browser.close();
