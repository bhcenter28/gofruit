/**
 * selliTem IndexedDB reader → Supabase
 * Czyta produkty bezpośrednio z IndexedDB po załadowaniu katalogu
 */
import { chromium } from "playwright";
import { writeFileSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(
  env["NEXT_PUBLIC_SUPABASE_URL"],
  env["SUPABASE_SERVICE_ROLE_KEY"]
);

function toSlug(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")
    .replace(/ł/g,"l").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

// ── Otwórz przeglądarkę ───────────────────────────────────────────────────────
const browser = await chromium.launch({ headless: false, slowMo: 50 });
const ctx = await browser.newContext();
const page = await ctx.newPage();

// ── Logowanie ─────────────────────────────────────────────────────────────────
console.log("1. Otwieram selliTem i loguję...");
await page.goto(BASE + "/web/login", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(2000);

if (await page.$("input[type=password]")) {
  const loginIn = await page.$("input[type=text], input[name*=user], input[name*=login]");
  if (loginIn) await loginIn.fill(LOGIN);
  await page.fill("input[type=password]", PASS);
  await page.keyboard.press("Enter");
  console.log("   Czekam na załadowanie aplikacji...");
}

// Czekaj aż skończy się sync — URL musi wyjść z /login i /sync
await page.waitForURL(u => !u.includes("/login"), { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2000);

// Jeśli na /sync — czekaj aż przejdzie dalej (może długo)
if (page.url().includes("/sync")) {
  console.log("   Trwa synchronizacja (może potrwać kilka minut)...");
  console.log("   Proszę czekać i nie zamykać przeglądarki.");
  await page.waitForURL(u => !u.includes("/sync"), { timeout: 300000 }).catch(() => {
    console.log("   Sync nie zakończył się automatycznie, kontynuuję...");
  });
  await page.waitForTimeout(3000);
}

console.log("   URL:", page.url());

// ── Czytaj store "products" z TsmDatabase ────────────────────────────────────
console.log("\n2. Czekam aż TsmDatabase.products się zapełni...");

async function readStore(dbName, storeName) {
  return await page.evaluate(({ dbName, storeName }) => {
    return new Promise((resolve) => {
      const req = indexedDB.open(dbName);
      req.onerror = () => resolve([]);
      req.onsuccess = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) { db.close(); resolve([]); return; }
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const all = store.getAll();
        all.onsuccess = (ev) => { db.close(); resolve(ev.target.result); };
        all.onerror   = () => { db.close(); resolve([]); };
      };
    });
  }, { dbName, storeName });
}

// Czekaj aż sync się zakończy — liczba produktów musi się ustabilizować
let products = [];
let lastCount = -1;
let stableFor = 0;
const STABLE_NEEDED = 3; // 3 x 15s = 45s bez zmian = sync skończony
const deadline = Date.now() + 20 * 60 * 1000; // max 20 minut

console.log("   (czekam aż sync skończy pobierać wszystkie produkty...)");

while (Date.now() < deadline) {
  await page.waitForTimeout(15000);
  products = await readStore("TsmDatabase", "products");
  const count = products.length;

  if (count === lastCount && count > 0) {
    stableFor++;
    process.stdout.write(`   products: ${count} — stabilny ${stableFor}/${STABLE_NEEDED}...\r`);
    if (stableFor >= STABLE_NEEDED) {
      console.log(`\n   ✅ Sync zakończony: ${count} produktów`);
      break;
    }
  } else {
    stableFor = 0;
    process.stdout.write(`   products: ${count} (sync w toku)...\r`);
  }
  lastCount = count;
}

if (products.length === 0) {
  console.log("\n⚠️  products store pusty po 20 minutach.");
  await page.waitForTimeout(30000);
  await browser.close();
  process.exit(0);
}

const foundIn = "TsmDatabase.products";

console.log(`\n✅ Znaleziono ${products.length} produktów w ${foundIn}`);
console.log(`   Pola: ${Object.keys(products[0]).slice(0,10).join(", ")}`);
writeFileSync("scripts/sellitem-products.json", JSON.stringify(products, null, 2));
console.log("   Zapisano do scripts/sellitem-products.json");

// ── Wgraj do Supabase ─────────────────────────────────────────────────────────
// Odczytaj pomocnicze słowniki
console.log("   Odczytuję grupy, jednostki, producentów...");
const groups = await readStore("TsmDatabase", "productGroups");
const units  = await readStore("TsmDatabase", "units");
const mfrs   = await readStore("TsmDatabase", "manufacturers");
const groupMap = Object.fromEntries(groups.map(g => [g.id, g.name || g.nazwa || ""]));
const unitMap  = Object.fromEntries(units.map(u => [u.id, u.name || u.shortName || u.nazwa || "szt"]));
const mfrMap   = Object.fromEntries(mfrs.map(m => [m.id, m.name || m.nazwa || ""]));
console.log(`   Grupy: ${groups.length}, Jednostki: ${units.length}, Producenci: ${mfrs.length}`);

console.log("\n3. Wgrywam do Supabase...");
const mapped = products.map((p) => {
  const nazwa = String(p.name || "").trim();
  if (!nazwa || nazwa === "GRATIS") return null;
  const slug = toSlug(nazwa) + `-${p.id}`;
  return {
    nazwa, slug,
    indeks_erp: String(p.id || ""),
    kategoria: groupMap[p.groupId] || null,
    podkategoria: p.subGroup1Id ? String(p.subGroup1Id) : null,
    podpodgrupa: p.subGroup2Id ? String(p.subGroup2Id) : null,
    jednostka: unitMap[p.unitId] || "szt",
    cena_netto: parseFloat(p.price || 0) || null,
    zdjecie_url: null,
    znacznik: mfrMap[p.manufacturerId] || null,
    marka: p.brand || null,
    kod_kreskowy: p.barCode || null,
    waga_netto: p.netWeight ? `${p.netWeight}g` : null,
    waga_brutto: p.grossWeight ? `${p.grossWeight}g` : null,
    karton: parseInt(p.carteQuantity || 0) || null,
    dostepny: !p.salesBlocked,
    blokada_sprzedazy: p.salesBlocked || false,
  };
}).filter(Boolean);

let inserted = 0;
for (let i = 0; i < mapped.length; i += 100) {
  const { error } = await supabase.from("produkty").upsert(mapped.slice(i, i+100), { onConflict: "slug" });
  if (error) console.error("❌", error.message);
  else { inserted += Math.min(100, mapped.length-i); console.log(`   ✅ ${inserted}/${mapped.length}`); }
}
console.log(`\n🎉 Gotowe! ${inserted} produktów w Supabase.`);
await browser.close();
