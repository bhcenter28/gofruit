/**
 * Diagnoza błędów zdjęć — testuje ~100 produktów bez zdjęcia
 * Uruchom: cd fruit && node scripts/diagnose-photos.mjs
 */
import { chromium } from "playwright";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";
const TEST_LIMIT = 100; // ile produktów przetestować

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

// Pobierz produkty BEZ zdjęcia z Supabase
console.log("Szukam produktów bez zdjęcia w Supabase...");
const { data: missing, error: missingErr } = await supabase
  .from("produkty")
  .select("id, indeks_erp, nazwa")
  .is("zdjecie_url", null)
  .not("indeks_erp", "is", null)
  .limit(TEST_LIMIT + 50); // trochę więcej bo niektóre mogą nie mieć imageRowId

if (missingErr) { console.error("Błąd Supabase:", missingErr); process.exit(1); }
console.log(`Produktów bez zdjęcia: ${missing.length} (biorę pierwsze ${TEST_LIMIT})`);

const missingErpSet = new Set(missing.map(p => String(p.indeks_erp)));

// LOGOWANIE
console.log("\nUruchamiam przeglądarkę...");
const browser = await chromium.launch({ headless: true });
const ctx  = await browser.newContext();
const page = await ctx.newPage();

await page.goto(BASE + "/web/login", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
if (await page.$("input[type=password]")) {
  const u = await page.$("input[type=text], input[name*=user]");
  if (u) await u.fill(LOGIN);
  await page.fill("input[type=password]", PASS);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
}

// SYNC IndexedDB
console.log("Czekam na sync...");
let last = 0, stable = 0;
const dl = Date.now() + 15 * 60 * 1000;
while (Date.now() < dl) {
  await page.waitForTimeout(15000);
  const count = await page.evaluate(() => new Promise(res => {
    const r = indexedDB.open("TsmDatabase");
    r.onsuccess = e => {
      const db = e.target.result;
      const t = db.transaction("products","readonly").objectStore("products").count();
      t.onsuccess = ev => { db.close(); res(ev.target.result); };
    };
    r.onerror = () => res(0);
  }));
  if (count === last && count > 1000) { stable++; if (stable >= 2) break; }
  else stable = 0;
  last = count;
  process.stdout.write(`  ${count} stable:${stable}/2\r`);
}
console.log(`\nSync: ${last} produktów`);

// Pobierz mapę productId → imageUrl z IndexedDB
const imageMap = await page.evaluate(() => new Promise(res => {
  const r = indexedDB.open("TsmDatabase");
  r.onsuccess = e => {
    const db = e.target.result;
    const store = db.transaction("products", "readonly").objectStore("products");
    const result = [];
    const req = store.openCursor();
    req.onsuccess = ev => {
      const cursor = ev.target.result;
      if (!cursor) { db.close(); res(result); return; }
      const p = cursor.value;
      if (p.mainImageRowId && p.mainImageRowId > 0) {
        result.push({ productId: String(p.id), rowId: p.mainImageRowId });
      }
      cursor.continue();
    };
  };
  r.onerror = () => res([]);
}));

// Zawęź tylko do produktów bez zdjęcia
const toTest = imageMap
  .filter(m => missingErpSet.has(m.productId))
  .slice(0, TEST_LIMIT);

console.log(`\nZnaleziono ${toTest.length} produktów bez zdjęcia z mainImageRowId`);
if (toTest.length === 0) {
  console.log("Nie ma co testować — wszystkie produkty z IndexedDB już mają zdjęcia!");
  await browser.close();
  process.exit(0);
}

// Buduj mapę erpToSupabaseId
const erpToId = {};
for (const p of missing) erpToId[String(p.indeks_erp)] = p.id;

// TESTUJ PRÓBKĘ
console.log(`\nTestuję ${toTest.length} produktów...\n`);

let ok = 0, errors = [];

for (let i = 0; i < toTest.length; i++) {
  const { productId, rowId } = toTest[i];
  const imageUrl = `${BASE}/server/api/tos/tsm/sync/image/${rowId}`;
  const supabaseId = erpToId[productId];

  process.stdout.write(`\r  [${i+1}/${toTest.length}] ok:${ok} err:${errors.length}`);

  try {
    const result = await page.evaluate(async (url) => {
      const resp = await fetch(url, { credentials: "include" });
      if (!resp.ok) return { ok: false, status: resp.status };
      const ab = await resp.arrayBuffer();
      return { ok: true, size: ab.byteLength, type: resp.headers.get("content-type") };
    }, imageUrl);

    if (!result.ok) {
      errors.push({ productId, rowId, error: `HTTP ${result.status}` });
      continue;
    }
    if (result.size < 100) {
      errors.push({ productId, rowId, error: `Plik za mały: ${result.size}B (type: ${result.type})` });
      continue;
    }

    // Sprawdź czy już w Storage
    const ext = (result.type || "").includes("png") ? "png" : "webp";
    const file = `${rowId}.${ext}`;
    const { data: existing } = await supabase.storage.from("product-images").list("", { search: file });
    if (existing && existing.length > 0) {
      errors.push({ productId, rowId, error: `Storage: plik już istnieje (${file}) ale brak URL w DB` });
      continue;
    }

    ok++;
  } catch (e) {
    errors.push({ productId, rowId, error: `Exception: ${e.message.slice(0, 100)}` });
  }
}

console.log(`\n\n=== WYNIKI DIAGNOZY ===`);
console.log(`OK (fetch działa):  ${ok}`);
console.log(`Błędy:              ${errors.length}`);

// Grupuj błędy
const groups = {};
for (const e of errors) {
  const key = e.error.replace(/\d{4,}/g, "N").slice(0, 60);
  if (!groups[key]) groups[key] = [];
  groups[key].push(e);
}

console.log(`\n📊 Typy błędów:`);
for (const [k, v] of Object.entries(groups).sort((a,b) => b[1].length - a[1].length)) {
  console.log(`  ${v.length}x  "${k}"`);
  // Pokaż 3 przykłady
  v.slice(0, 3).forEach(e => console.log(`       productId:${e.productId} rowId:${e.rowId}`));
}

await browser.close();
