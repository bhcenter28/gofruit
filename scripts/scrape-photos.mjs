/**
 * Pobierz zdjęcia produktów z selliTem i wgraj do Supabase Storage
 * Uruchom: cd fruit && node scripts/scrape-photos.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { createClient } from "@supabase/supabase-js";
import { normalizeImage } from "./normalize-util.mjs";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

// ================================================================
// PRZEGLĄDARKA I LOGOWANIE
// ================================================================
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

// Czekaj na sync
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
  if (count === last && count > 1000) { stable++; if (stable >= 3) break; }
  else stable = 0;
  last = count;
  process.stdout.write(`  ${count} stable:${stable}/3\r`);
}
console.log(`\nSync: ${last} produktów`);

// ================================================================
// ODCZYTAJ productId → mainImageRowId bezpośrednio z products store
// ================================================================
console.log("Odczytuję mainImageRowId z products...");

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
        result.push({
          productId: String(p.id),
          imageUrl: `https://sellitemhtm.ihurt.pl/server/api/tos/tsm/sync/image/${p.mainImageRowId}`
        });
      }
      cursor.continue();
    };
  };
  r.onerror = () => res([]);
}));

console.log(`Znaleziono ${imageMap.length} produktów z mainImageRowId > 0`);

if (imageMap.length === 0) {
  console.log("Brak zdjęć do pobrania.");
  await browser.close();
  process.exit(0);
}

// ================================================================
// POBIERZ PRODUKTY Z SUPABASE
// ================================================================
const FORCE_RESCRAPE = process.argv.includes("--force");
console.log(`Ładuję produkty z Supabase... ${FORCE_RESCRAPE ? "(tryb --force: wszystkie, nawet z istniejącym zdjęciem)" : "(tylko bez zdjęcia)"}`);
const erpToId = {};
let from = 0;
while (true) {
  let query = supabase
    .from("produkty")
    .select("id, indeks_erp")
    .not("indeks_erp", "is", null);
  if (!FORCE_RESCRAPE) query = query.is("zdjecie_url", null);
  const { data, error } = await query.range(from, from + 999);
  if (error || !data || data.length === 0) break;
  for (const p of data) erpToId[String(p.indeks_erp)] = p.id;
  if (data.length < 1000) break;
  from += 1000;
}
console.log(`Produktów do przetworzenia: ${Object.keys(erpToId).length}`);

// Filtruj imageMap — tylko produkty które mamy w DB
const filteredMap = imageMap.filter(m => erpToId[m.productId]);
console.log(`Po filtracji: ${filteredMap.length} zdjęć do pobrania`);

// ================================================================
// POBIERZ I WGRAJ ZDJĘCIA
// ================================================================
// Test kilku zdjęć żeby sprawdzić czy serwer działa
if (filteredMap.length > 0) {
  const testItems = filteredMap.slice(0, 5);
  let anyOk = false;
  for (const item of testItems) {
    const url = item.imageUrl.replace("https://sellitemhtm.ihurt.pl:443/", "https://sellitemhtm.ihurt.pl/");
    const r = await page.evaluate(async (u) => {
      const resp = await fetch(u, { credentials: "include" });
      return { status: resp.status, ok: resp.ok };
    }, url);
    console.log(`Test: ...${url.slice(-10)} → ${r.status}`);
    if (r.ok) { anyOk = true; break; }
  }
  if (!anyOk) {
    console.log("⚠️  Serwer ERP zwraca błędy dla wszystkich testów. Poczekaj chwilę i spróbuj ponownie.");
    await browser.close();
    process.exit(1);
  }
}

let uploaded = 0, skipped = 0, errors = 0, noMatch = 0;
const CONCURRENCY = 5;
const errorSamples = [];
const errorCounts = {};
const fetchEmptyItems = [];

async function processImage({ productId, imageUrl }) {
  const supabaseId = erpToId[productId];
  if (!supabaseId) return "no-match";

  const url = imageUrl.replace("https://sellitemhtm.ihurt.pl:443/", "https://sellitemhtm.ihurt.pl/");
  const rowId = url.split("/").pop();

  try {
    // page.evaluate z base64 — zachowuje auth, szybsze niż Array.from
    let buffer = null;
    let contentType = "image/jpeg";
    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await page.evaluate(async (u) => {
        const resp = await fetch(u, { credentials: "include" });
        if (!resp.ok) return { ok: false, status: resp.status };
        const ab = await resp.arrayBuffer();
        const bytes = new Uint8Array(ab);
        let bin = "";
        const chunk = 8192;
        for (let i = 0; i < bytes.length; i += chunk)
          bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
        return { ok: true, b64: btoa(bin), type: resp.headers.get("content-type") || "image/jpeg" };
      }, url);
      if (result.ok) { buffer = Buffer.from(result.b64, "base64"); contentType = result.type; break; }
      if (result.status !== 502 && result.status !== 503) return `fetch-fail:${result.status}`;
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    }
    if (!buffer || buffer.length < 100) {
      fetchEmptyItems.push({ productId, imageUrl: url, supabaseId });
      return `fetch-empty`;
    }

    // Normalizuj — przytnij białe marginesy, wycentruj produkt
    let finalBuffer = buffer;
    try {
      const norm = await normalizeImage(buffer);
      if (norm !== buffer) finalBuffer = norm;
    } catch { /* fallback: oryginał */ }

    const file = `${rowId}.png`;

    // Wgraj do Supabase Storage (zawsze PNG po normalizacji)
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(file, finalBuffer, { contentType: "image/png", upsert: true });
    if (uploadError) {
      if (uploadError.message.includes("already exists") || uploadError.message.includes("The resource already exists")) {
        // Plik już jest — tylko zaktualizuj URL
        skipped++;
      } else {
        return `upload-error:${uploadError.message}`;
      }
    }

    // Publiczny URL
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(file);

    // Zaktualizuj zdjecie_url
    const { error: updateError } = await supabase
      .from("produkty")
      .update({ zdjecie_url: publicUrl })
      .eq("id", supabaseId);

    if (updateError) return `update-error:${updateError.message}`;
    return "ok";
  } catch (err) {
    return `error:${err.message.slice(0, 80)}`;
  }
}

function trackError(msg) {
  errors++;
  const key = msg.replace(/:\d+$/, "").slice(0, 50); // grupuj podobne
  errorCounts[key] = (errorCounts[key] || 0) + 1;
  if (errorSamples.length < 30) errorSamples.push(msg);
}

console.log(`\nPobieram i wgrywam ${filteredMap.length} zdjęć...`);

for (let i = 0; i < filteredMap.length; i += CONCURRENCY) {
  const batch = filteredMap.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map(item => processImage(item)));

  for (const r of results) {
    if (r === "ok") uploaded++;
    else if (r === "no-match") noMatch++;
    else trackError(r);
  }

  const pct = Math.round(((i + batch.length) / filteredMap.length) * 100);
  process.stdout.write(`\r  [${i + batch.length}/${filteredMap.length}] ${pct}% — wgrano:${uploaded} pominięto:${skipped} no-match:${noMatch} błędy:${errors}   `);
}

console.log(`\n
==============================================
✅ ZDJĘCIA GOTOWE
   Wgrano:    ${uploaded}
   Pominięto: ${skipped} (już były)
   Bez match: ${noMatch}
   Błędy:     ${errors}
==============================================`);

if (errors > 0) {
  console.log("\n📊 Typy błędów:");
  for (const [k, v] of Object.entries(errorCounts).sort((a,b) => b[1]-a[1])) {
    console.log(`  ${v}x  ${k}`);
  }
  console.log("\n🔍 Próbki błędów (pierwsze 30):");
  errorSamples.forEach((e, i) => console.log(`  ${i+1}. ${e}`));
}

if (fetchEmptyItems.length > 0) {
  const outPath = join(dirname(fileURLToPath(import.meta.url)), "..", "fetch-empty-products.json");
  writeFileSync(outPath, JSON.stringify(fetchEmptyItems, null, 2), "utf-8");
  console.log(`\n📁 Zapisano ${fetchEmptyItems.length} produktów z fetch-empty do: fetch-empty-products.json`);
}

await browser.close();
