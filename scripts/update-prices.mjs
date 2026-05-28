/**
 * Aktualizuje ceny i zdjęcia z selliTem → Supabase
 * Uruchom: node scripts/update-prices.mjs
 */
import { chromium } from "playwright";
import { readFileSync } from "fs";
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

function bestPrice(p) {
  // price/priceF = cena hurtowa netto, priceD = cena detaliczna (znacznie wyższa, ostatni fallback)
  const candidates = [p.price, p.priceF, p.priceP, p.priceS, p.priceX3, p.price12, p.priceD];
  for (const c of candidates) {
    const v = parseFloat(c);
    if (v > 0) return v;
  }
  return null;
}

function buildPromoMap(promotions) {
  // Zwraca mapę productId → najniższa aktywna cena promocyjna (fixedPrice)
  const map = {};
  for (const promo of promotions) {
    if (!promo.isActive) continue;
    for (const set of (promo.sets || [])) {
      for (const b of (set.benefits || [])) {
        if (b.type === "discount" && b.discountType === "fixed" && b.fixedPrice > 0) {
          if (!map[b.productId] || b.fixedPrice < map[b.productId]) {
            map[b.productId] = b.fixedPrice;
          }
        }
      }
    }
  }
  return map;
}

const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext();
const page = await ctx.newPage();

await page.goto(BASE + "/web/login", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
if (await page.$("input[type=password]")) {
  const u = await page.$("input[type=text], input[name*=user]");
  if (u) await u.fill(LOGIN);
  await page.fill("input[type=password]", PASS);
  await page.keyboard.press("Enter");
  // Czekaj aż nawigacja się skończy
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

// Czekaj na pełny sync
console.log("Czekam na sync...");
let products = [], images = [];
const deadline = Date.now() + 15 * 60 * 1000;
let lastCount = 0, stable = 0;
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
console.log(`\nSync zakończony: ${products.length} produktów`);

// Wczytaj promocje
console.log("Wczytuję promocje...");
const promotionsList = await readStore("promotions");
const promoMap = buildPromoMap(promotionsList);
console.log(`Produkty z ceną promocyjną: ${Object.keys(promoMap).length}`);
if (promoMap[3]) console.log(`  3 BIT BATON (id:3) → cena promocyjna: ${promoMap[3]}`);

// Sprawdź sample cen
const withPrice = products.filter(p => promoMap[p.id] !== undefined || bestPrice(p) !== null);
console.log(`Produkty z ceną: ${withPrice.length}/${products.length}`);
if (withPrice[0]) {
  const p = withPrice[0];
  const c = promoMap[p.id] ?? bestPrice(p);
  console.log(`Przykład: ${p.name} → promo:${promoMap[p.id]} price:${p.price} priceF:${p.priceF} → wybrana: ${c}`);
}

// Pobierz zdjęcia z IndexedDB
console.log("\nPobieranie obrazków...");
images = await readStore("catalogImagesData");
console.log(`Obrazki: ${images.length} rekordów`);
if (images[0]) console.log("Przykład:", JSON.stringify(images[0]));

// Buduj mapę zdjęć: productId → rowId
const imageMap = {};
for (const img of images) {
  if (img.productId && img.rowId && !imageMap[img.productId]) {
    imageMap[img.productId] = img.rowId;
  }
}
console.log(`Produkty ze zdjęciem: ${Object.keys(imageMap).length}`);

// Zbuduj URL zdjęcia — sprawdź kilka wariantów
const token = (await (await fetch(`${BASE}/server/api/tos/account/login`, {
  method: "POST", headers: {"Content-Type":"application/json"},
  body: JSON.stringify({userName: LOGIN, password: PASS})
})).json()).token;

// Przetestuj URL zdjęcia
const testProductId = Object.keys(imageMap)[0];
const testRowId = imageMap[testProductId];
const imageUrlCandidates = [
  `${BASE}/server/api/tos/tsm/productImages/${testRowId}`,
  `${BASE}/server/api/tos/images/${testRowId}`,
  `${BASE}/server/media/images/${testRowId}`,
  `${BASE}/server/api/tos/tsm/images/${testRowId}`,
];
let workingImageUrl = null;
for (const url of imageUrlCandidates) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok && res.headers.get("content-type")?.includes("image")) {
    workingImageUrl = url.replace(`/${testRowId}`, "/{rowId}");
    console.log(`✅ URL zdjęć: ${workingImageUrl}`);
    break;
  } else {
    console.log(`   ${res.status} ${url.replace(BASE,"")}`);
  }
}

// Aktualizuj ceny i zdjęcia w Supabase
console.log("\nAktualizuję ceny w Supabase...");
const BATCH = 500;
let updated = 0;

for (let i = 0; i < products.length; i += BATCH) {
  const batch = products.slice(i, i + BATCH);
  for (const p of batch) {
    // Cena promocyjna (fixedPrice) ma priorytet nad ceną bazową
    const cena = promoMap[p.id] !== undefined ? promoMap[p.id] : bestPrice(p);
    const rowId = imageMap[p.id] || (p.mainImageRowId > 0 ? p.mainImageRowId : null);
    const zdjecie_url = (workingImageUrl && rowId)
      ? workingImageUrl.replace("{rowId}", rowId)
      : null;
    const updateData = {};
    if (cena !== null) updateData.cena_netto = cena;
    if (zdjecie_url) updateData.zdjecie_url = zdjecie_url;
    if (Object.keys(updateData).length === 0) continue;
    const { error } = await supabase.from("produkty").update(updateData).eq("indeks_erp", String(p.id));
    if (!error) updated++;
  }
  process.stdout.write(`  ${Math.min(i+BATCH, products.length)}/${products.length}\r`);
}

console.log(`\n✅ Zaktualizowano ${updated} produktów`);

// Pokaż wyniki
const { data: stats } = await supabase.from("produkty")
  .select("cena_netto, zdjecie_url")
  .not("cena_netto", "is", null)
  .limit(3);
console.log("Przykłady z ceną:", stats?.map(s => `${s.cena_netto} zł`).join(", "));

await browser.close();
