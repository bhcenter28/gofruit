/**
 * Wybierz kontrahenta → zrób screenshot produktu 3 → odczytaj ceny ze wszystkich produktów
 * Uruchom: node scripts/scrape-contractor-prices.mjs
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

const browser = await chromium.launch({ headless: false, slowMo: 200 });
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
await page.goto(BASE + "/web/tsm/catalog", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(5000);

// Kliknij "Wybierz kontrahenta"
console.log("Szukam przycisku wyboru kontrahenta...");
const contractorBtn = await page.$("text=Wybierz kontrahenta, [class*='contractor'], [class*='kontra']");
if (contractorBtn) {
  await contractorBtn.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "contractor-select.png" });
  console.log("Kliknięto — screenshot: contractor-select.png");
} else {
  // Spróbuj header contractor button
  const btns = await page.$$("button, [role='button']");
  for (const btn of btns) {
    const text = await btn.textContent();
    if (text?.includes("kontrahent") || text?.includes("Wybierz")) {
      await btn.click();
      await page.waitForTimeout(3000);
      break;
    }
  }
  await page.screenshot({ path: "contractor-select.png" });
  console.log("Screenshot: contractor-select.png");
}

// Spróbuj wpisać numer kontrahenta lub wybrać z listy
await page.waitForTimeout(2000);
const inputs = await page.$$("input");
for (const inp of inputs) {
  const placeholder = await inp.getAttribute("placeholder");
  const visible = await inp.isVisible();
  if (visible) {
    console.log(`Input placeholder: "${placeholder}"`);
    if (placeholder?.toLowerCase().includes("szukaj") || placeholder?.toLowerCase().includes("kontra") || placeholder?.toLowerCase().includes("search")) {
      await inp.fill("800738");
      await page.waitForTimeout(2000);
      await page.screenshot({ path: "contractor-search.png" });
      console.log("Wpisano 800738 — screenshot: contractor-search.png");

      // Kliknij pierwszy wynik
      const firstResult = await page.$("[class*='option'], [class*='item'], [class*='result'], mat-option");
      if (firstResult) {
        await firstResult.click();
        console.log("Wybrano kontrahenta!");
      }
      break;
    }
  }
}

await page.waitForTimeout(3000);
await page.screenshot({ path: "after-contractor.png" });
console.log("Screenshot po wyborze kontrahenta: after-contractor.png");

// Szukaj produktu "3 BIT BATON" w katalogu
console.log("\nSzukam 3 BIT BATON w katalogu...");
const searchInput = await page.$("[placeholder*='Szukaj'], [placeholder*='szukaj'], input[type='search'], input[type='text']");
if (searchInput) {
  await searchInput.fill("3 BIT BATON");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "search-3bit.png" });
  console.log("Screenshot po wyszukaniu: search-3bit.png");
}

// Spróbuj odczytać ceny z DOM
const prices = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll("*"));
  return all
    .filter(el => {
      const t = el.innerText?.trim();
      return t && /^\d+[,\.]?\d*\s*(zł|PLN)?$/.test(t) && !el.children.length;
    })
    .map(el => ({
      tag: el.tagName,
      class: el.className?.slice(0, 60),
      text: el.innerText?.trim(),
    }))
    .slice(0, 30);
});
console.log("\nElementy z cenami w DOM:");
prices.forEach(p => console.log(`  ${p.tag}.${p.class}: "${p.text}"`));

await page.screenshot({ path: "final-state.png" });
console.log("\nOstateczny screenshot: final-state.png");

// Alternatywnie — odczytaj ceny bezpośrednio z IndexedDB
// po tym jak selliTem załadował kontrahenta (może zaktualizować IDB)
console.log("\n=== Ceny z IDB po wyborze kontrahenta ===");
const updatedProducts = await readStore("products");
const p3 = updatedProducts.find(p => p.id === 3);
if (p3) {
  console.log(`3 BIT BATON: price=${p3.price} priceD=${p3.priceD} priceF=${p3.priceF} priceZ=${p3.priceZ} priceS=${p3.priceS}`);
  const allFields = Object.keys(p3).filter(k => k.toLowerCase().includes("price")).map(k => `${k}:${JSON.stringify(p3[k])}`);
  console.log("Wszystkie pola cenowe:", allFields.join(" | "));
}

await browser.close();
