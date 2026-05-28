/**
 * Pobierz DOKŁADNE ceny wyświetlane przez selliTem z DOM + sprawdź promocję 7269
 * Uruchom: node scripts/get-dom-prices.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

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

// 1. Promocja 7269 — co to robi?
console.log("\n=== Promocja 7269 ===");
const promotions = await readStore("promotions");
const p7269 = promotions.find(p => p.rowId === 7269 || p.id === 7269);
if (p7269) {
  // Skróć output — pokaż tylko priority, typ i pierwsze 3 benefits
  console.log(`rowId:${p7269.rowId} priority:${p7269.priority} isActive:${p7269.isActive}`);
  const benefits = (p7269.sets||[]).flatMap(s => s.benefits||[]);
  const conditions = (p7269.sets||[]).flatMap(s => s.conditions||[]);
  console.log(`conditions: ${conditions.length}, benefits: ${benefits.length}`);
  console.log("Pierwsze 5 benefits:", JSON.stringify(benefits.slice(0, 5), null, 2));
  // Czy product 3 jest w benefits?
  const b3 = benefits.filter(b => b.productId === 3);
  console.log(`Benefits dla product 3: ${b3.length}`);
  b3.forEach(b => console.log(JSON.stringify(b)));
} else {
  console.log("Nie znaleziono 7269 po id/rowId. Szukam w zakresie rowId 7260-7280...");
  promotions.filter(p => p.rowId >= 7260 && p.rowId <= 7280).forEach(p => {
    console.log(`  rowId:${p.rowId} priority:${p.priority} isActive:${p.isActive} sets:${p.sets?.length}`);
  });
}

// 2. Nawiguj do katalogu i odczytaj ceny z DOM
console.log("\n=== Ceny z DOM selliTem ===");
console.log("Przechodzę do katalogu...");
await page.goto(BASE + "/web/tsm/catalog", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(10000);

// Spróbuj znaleźć produkty w DOM - szukaj wszelkich selektorów z cenami
const htmlSample = await page.evaluate(() => document.body.innerHTML.slice(0, 3000));
console.log("Początek HTML body:", htmlSample.replace(/\s+/g," ").slice(0, 500));

// Spróbuj różnych selektorów
const priceSelectors = [
  ".price", ".cena", "[class*='price']", "[class*='Price']", "[class*='cena']",
  ".product-price", ".item-price", "span[class*='cost']"
];
for (const sel of priceSelectors) {
  const count = await page.locator(sel).count();
  if (count > 0) {
    console.log(`Selektor "${sel}": ${count} elementów`);
    const first3 = await page.locator(sel).allTextContents();
    console.log("  Pierwsze 5:", first3.slice(0, 5));
    break;
  }
}

// Zrób screenshot żeby zobaczyć jak wygląda strona
await page.screenshot({ path: "catalog-screenshot.png", fullPage: false });
console.log("Screenshot zapisany: catalog-screenshot.png");

// Pobierz wszystkie produkty z IndexedDB i oblicz ceny według wzoru z discounts
console.log("\n=== Test formuły cenowej na produktach z bazy ===");
const products = await readStore("products");
const allDiscounts = await readStore("discounts");
const allPromos = await readStore("promotions");

// Znajdź discount dla manufacturerId=2 (FOODCARE), contractor 800738
const discForMfr2 = allDiscounts.find(d =>
  String(d.contractorId) === "800738" && d.manufacturerId === 2 && d.groupId === 0
);
console.log("Discount dla FOODCARE (mfr=2):", JSON.stringify(discForMfr2));

// Przetestuj różne formuły dla produktu 3
const p3 = products.find(p => p.id === 3);
if (p3) {
  const disc = discForMfr2;
  const pct = disc?.discountPercent / 100 || 0;
  console.log(`\nProdukt 3: ${p3.name}`);
  console.log(`  price:${p3.price} priceD:${p3.priceD} priceF:${p3.priceF} priceZ:${p3.priceZ}`);
  console.log(`  stockBuyPrice[0].avg: ${p3.stockBuyPrice?.[0]?.avg} (warehouse: ${p3.stockBuyPrice?.[0]?.warehouseId})`);
  console.log(`  stockBuyPrice[1].avg: ${p3.stockBuyPrice?.[1]?.avg} (warehouse: ${p3.stockBuyPrice?.[1]?.warehouseId})`);
  console.log(`  discountPercent: ${disc?.discountPercent}% discountType: ${disc?.discountType}`);

  // Przetestuj wszystkie możliwe formuły
  const bases = {
    price: p3.price, priceD: p3.priceD, priceF: p3.priceF, priceZ: p3.priceZ,
    buyPrice80: p3.stockBuyPrice?.[0]?.avg, buyPrice01: p3.stockBuyPrice?.[1]?.avg
  };
  console.log("\n  Wyniki różnych formuł (szukamy 2.24):");
  for (const [name, base] of Object.entries(bases)) {
    if (!base || base === 0) continue;
    const narzut = Math.round(base * (1 + pct) * 100) / 100;
    const marza  = Math.round(base / (1 - pct) * 100) / 100;
    const rabat  = Math.round(base * (1 - pct) * 100) / 100;
    console.log(`    ${name}=${base}: +${disc?.discountPercent}%narzut=${narzut} /${(1-pct).toFixed(2)}marza=${marza} -${disc?.discountPercent}%rabat=${rabat}`);
  }
}

await browser.close();
