/**
 * Znajdź DOKŁADNY skąd pochodzi 2.24 dla produktu id:3
 * Uruchom: node scripts/check-exact-price.mjs
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
  if (count === lastCount && count > 1000) { stable++; if (stable >= 3) break; }
  else { stable = 0; }
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

// 1. contractorPromotions — pełne dane
console.log("\n=== contractorPromotions (pełne) ===");
const cp = await readStore("contractorPromotions");
cp.forEach(r => console.log(JSON.stringify(r, null, 2)));

// 2. WSZYSTKIE aktywne promocje z fixedPrice dla product id:3
console.log("\n=== Aktywne promocje z fixedPrice dla product 3 ===");
const promos = await readStore("promotions");
const promos3 = promos.filter(p =>
  p.isActive &&
  (p.sets||[]).some(s => (s.benefits||[]).some(b => b.productId === 3 && b.fixedPrice > 0))
);
console.log(`Znaleziono: ${promos3.length}`);
promos3.forEach(p => {
  const prices = (p.sets||[]).flatMap(s =>
    (s.benefits||[]).filter(b => b.productId === 3 && b.fixedPrice > 0).map(b => b.fixedPrice)
  );
  console.log(`  id:${p.id} rowId:${p.rowId} priority:${p.priority} fixedPrices:[${prices.join(",")}]`);
});

// 3. discounts dla naszych kontrahentów (800738, 801730)
console.log("\n=== Discounts dla kontrahentów 800738 / 801730 ===");
const allDiscounts = await readStore("discounts");
const ourDiscounts = allDiscounts.filter(d =>
  String(d.contractorId) === "800738" || String(d.contractorId) === "801730"
);
console.log(`${ourDiscounts.length} rekordów`);
ourDiscounts.forEach(d => console.log(JSON.stringify(d)));
if (allDiscounts[0]) console.log("\nStruktura discounts:", JSON.stringify(allDiscounts[0], null, 2));

// 4. erpGlobalParameters — mogą zawierać globalne marże
console.log("\n=== erpGlobalParameters ===");
const params = await readStore("erpGlobalParameters");
params.forEach(p => console.log(JSON.stringify(p)));

// 5. currencyPrices — czy są specjalne ceny walutowe?
console.log("\n=== currencyPrices ===");
const cpx = await readStore("currencyPrices");
console.log(`${cpx.length} rekordów`);
if (cpx[0]) console.log("Przykład:", JSON.stringify(cpx[0], null, 2));
const cpx3 = cpx.filter(r => r.productId === 3);
if (cpx3.length) { console.log("Dla product 3:"); cpx3.forEach(r => console.log(JSON.stringify(r))); }

// 6. Nawiguj do katalogu i odczytaj cenę z DOM dla pierwszych 5 produktów
console.log("\n=== Ceny z DOM selliTem (pierwsze 5 produktów) ===");
try {
  await page.goto(BASE + "/web/tsm/catalog", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(8000);
  const domPrices = await page.evaluate(() => {
    // Szukaj kart produktów w DOM
    const cards = Array.from(document.querySelectorAll("[class*='product'], [class*='item'], [class*='card']"));
    return cards.slice(0, 20).map(card => ({
      text: card.innerText?.slice(0, 200),
      price: card.querySelector("[class*='price'], [class*='cena']")?.innerText,
      html: card.innerHTML?.slice(0, 300),
    }));
  });
  domPrices.filter(d => d.price || d.text?.includes("zł")).slice(0, 5).forEach(d => {
    console.log("  price:", d.price, "| text:", d.text?.replace(/\n/g," ").slice(0,100));
  });
} catch(e) {
  console.log("DOM scrape error:", e.message);
}

await browser.close();
