/**
 * Wybierz kontrahenta [800738] FRUIT → scrape wszystkich cen z katalogu
 * Uruchom: node scripts/scrape-prices-final.mjs
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

const browser = await chromium.launch({ headless: false, slowMo: 100 });
const ctx = await browser.newContext();
const page = await ctx.newPage();

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
  if (count === lastCount && count > 1000) { stable++; if (stable >= 3) break; }
  else { stable = 0; }
  lastCount = count;
  process.stdout.write(`  products:${count} stable:${stable}/3\r`);
}
console.log(`\nSync done`);

// Idź do katalogu
console.log("Otwieram katalog...");
await page.goto(BASE + "/web/tsm/catalog", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(5000);

// Kliknij "Wybierz kontrahenta" w headerze
console.log("Klikam Wybierz kontrahenta...");
await page.click("text=Wybierz kontrahenta");
await page.waitForTimeout(2000);

// Kliknij pozycję zawierającą [800738] FRUIT
console.log("Klikam kontrahenta [800738] FRUIT...");
await page.click("text=[800738]");
await page.waitForTimeout(3000);

await page.screenshot({ path: "catalog-with-contractor.png" });
console.log("Screenshot z kontrahentem: catalog-with-contractor.png");

// Sprawdź czy po wyborze kontrahenta IDB się zaktualizowało
console.log("\n=== Ceny z IDB po wyborze kontrahenta 800738 ===");
const products = await readStore("products");
const p3 = products.find(p => p.id === 3);
if (p3) {
  const allPriceFields = Object.entries(p3)
    .filter(([k]) => k.toLowerCase().includes("price") && !k.includes("Buy") && !k.includes("Unit") && !k.includes("Ud") && !k.includes("package"))
    .map(([k,v]) => `${k}:${typeof v === "object" ? JSON.stringify(v) : v}`);
  console.log(`3 BIT BATON: ${allPriceFields.join(" | ")}`);
}

// Pokaż 5 produktów w widoku listy
console.log("\n=== Szukam cen w DOM ===");

// Przełącz na widok z cenami (kliknij ikonę % jeśli dostępna)
const pctBtn = await page.$("[aria-label*='%'], button:has-text('%'), .percent-btn");
if (pctBtn) {
  await pctBtn.click();
  await page.waitForTimeout(2000);
  console.log("Kliknięto przycisk %");
}

// Szukaj produktu 3 BIT w wyszukiwarce katalogu
const catalogSearch = page.locator("input[placeholder*='Szukaj'], input[placeholder*='Produkt']").first();
if (await catalogSearch.count() > 0) {
  await catalogSearch.click();
  await catalogSearch.fill("3 BIT BATON");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "search-result.png" });
  console.log("Wyniki wyszukiwania: search-result.png");
}

// Pobierz wszystkie widoczne ceny z DOM
const domItems = await page.evaluate(() => {
  // Zbierz wszystkie elementy z tekstem zawierającym "zł" lub liczby z przecinkiem
  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const txt = walker.currentNode.textContent.trim();
    if (/^\d+[,\.]?\d*\s*(zł)?$/.test(txt) && parseFloat(txt.replace(",",".")) > 0 && parseFloat(txt.replace(",",".")) < 1000) {
      const parent = walker.currentNode.parentElement;
      results.push({
        price: txt,
        tag: parent?.tagName,
        class: parent?.className?.slice(0, 80),
        nearText: parent?.closest("[class*='row'],[class*='item'],[class*='product']")?.innerText?.slice(0, 100)
      });
    }
  }
  return results;
});

console.log("\nWszystkie ceny w DOM:");
domItems.slice(0, 20).forEach(i => console.log(`  "${i.price}" | ${i.tag}.${i.class?.split(" ")[0]} | near: "${i.nearText?.replace(/\n/g," ").slice(0,80)}"`));

// Kliknij na 3 BIT BATON żeby zobaczyć szczegóły
console.log("\nKlikam na 3 BIT BATON...");
const bitItem = page.locator("text=3 BIT BATON").first();
if (await bitItem.count() > 0) {
  await bitItem.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "product-detail.png" });
  console.log("Szczegóły produktu: product-detail.png");

  // Odczytaj cenę z detalu
  const detailPrices = await page.evaluate(() => {
    const all = [];
    document.querySelectorAll("*").forEach(el => {
      if (!el.children.length) {
        const t = el.innerText?.trim();
        if (t && /\d+[,\.]\d+/.test(t) && t.length < 20) {
          all.push({ text: t, class: el.className?.slice(0,60), tag: el.tagName });
        }
      }
    });
    return all.filter(x => x.text.includes(",") || x.text.includes("zł")).slice(0, 20);
  });
  console.log("Ceny na stronie produktu:");
  detailPrices.forEach(p => console.log(`  "${p.text}" | ${p.tag}.${p.class}`));
}

await browser.close();
