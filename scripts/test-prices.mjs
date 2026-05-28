/**
 * TEST: scrapuje ceny dla 100 produktów z Supabase i pokazuje wyniki BEZ zapisu do bazy.
 * Weryfikuj ręcznie kilka cen w zamawiarce zanim puścisz pełny scrape.
 * Uruchom: cd fruit && node scripts/test-prices.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";
const LIMIT = 100;

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

// Pobierz 100 produktów z cenami (żeby łatwo porównać)
console.log(`Pobieram ${LIMIT} produktów z Supabase...`);
const { data: produkty } = await supabase
  .from("produkty")
  .select("id, nazwa, cena_netto")
  .not("cena_netto", "is", null)
  .limit(LIMIT);
console.log(`Pobrano: ${produkty.length}`);

// ── Przeglądarka ──────────────────────────────────────────────────
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

// ── Sync IndexedDB ────────────────────────────────────────────────
console.log("Sync...");
let last = 0, stable = 0;
while (true) {
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

// ── Nawigacja i kontrahent ────────────────────────────────────────
await page.goto(BASE + "/web/tsm", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(4000);

// Wybierz kontrahenta [800738] jeśli trzeba
const bodyText = await page.evaluate(() => document.body.innerText);
if (!bodyText.includes("800738")) {
  const btns = await page.$$("button,[role='button']");
  for (const btn of btns) {
    const t = (await btn.textContent().catch(() => "")).toLowerCase();
    if (t.includes("kontrahent") || t.includes("wybierz")) { await btn.click(); break; }
  }
  await page.waitForTimeout(2000);
  const item = await page.$("text=[800738]");
  if (item) { await item.click(); await page.waitForTimeout(4000); console.log("Kontrahent [800738] wybrany"); }
}

// Katalog
const katalog = page.locator("text=Katalog").first();
if (await katalog.count() > 0) { await katalog.click(); await page.waitForTimeout(3000); }
else { await page.goto(BASE + "/web/tsm/catalog", { waitUntil: "domcontentloaded" }).catch(() => {}); }
await page.waitForTimeout(2000);

// Znajdź wyszukiwarkę
const inputs = await page.evaluate(() =>
  [...document.querySelectorAll("input")].map(i => {
    const r = i.getBoundingClientRect();
    return { ng: i.getAttribute("ng-reflect-placeholder") || "", w: r.width, h: r.height, x: r.left, y: r.top, visible: r.width > 0 };
  }).filter(i => i.visible).sort((a, b) => a.y - b.y)
);
const sc = inputs.find(i => i.ng.toLowerCase().includes("szukaj")) || inputs.find(i => i.w > 150);
if (!sc) { console.error("Nie znaleziono wyszukiwarki!"); await browser.close(); process.exit(1); }
const searchX = sc.x + sc.w / 2, searchY = sc.y + sc.h / 2;
console.log(`Wyszukiwarka znaleziona (y=${Math.round(sc.y)})\n`);

// ── Matching ──────────────────────────────────────────────────────
function words(s) {
  return s.toUpperCase().replace(/[.,\-\/]/g, " ").split(/\s+/).filter(w => w.length > 1);
}
// Zwraca % słów z query które są w result (0..1)
function matchScore(query, result) {
  const qw = words(query);
  const rw = new Set(words(result));
  const common = qw.filter(w => rw.has(w)).length;
  return qw.length > 0 ? common / qw.length : 0;
}

async function readRows() {
  return page.evaluate(() => {
    const rows = [];
    for (const tr of document.querySelectorAll("tr")) {
      const tds = [...tr.querySelectorAll("td")];
      if (tds.length < 3) continue;
      const priceTd = tds.find(td => /\d+[,\.]\d+\s*zł/.test(td.innerText));
      if (!priceTd) continue;
      const nameTd = tr.querySelector("td.left") || tds.find(td => td !== priceTd && td.innerText?.trim().length > 3);
      if (!nameTd) continue;
      const name  = nameTd.innerText.trim().split("\n")[0].trim();
      const match = priceTd.innerText.match(/(\d+[,\.]\d+)/);
      const price = match ? parseFloat(match[1].replace(",", ".")) : 0;
      if (name && price > 0.5) rows.push({ name, price }); // pomijaj kaucje
    }
    return rows;
  });
}

async function searchProduct(nazwa) {
  const query = nazwa.trim().replace(/^\*+/, "").slice(0, 30);

  await page.mouse.click(searchX, searchY);
  await page.waitForTimeout(100);
  await page.keyboard.press("Control+A");
  await page.keyboard.type(query);
  await page.waitForTimeout(1200);

  const rows = await readRows();
  if (rows.length === 0) return null;

  // Znajdź najlepsze dopasowanie
  let best = null, bestScore = 0;
  for (const row of rows) {
    const score = matchScore(nazwa, row.name);
    if (score > bestScore) { bestScore = score; best = row; }
  }

  // Wymagaj >= 60% słów wspólnych
  if (bestScore >= 0.6 && best) return { price: best.price, score: bestScore, matched: best.name };
  return null;
}

// ── Główna pętla ──────────────────────────────────────────────────
const results = [];
console.log("Scrapuję ceny (bez zapisu do bazy)...\n");
console.log("─".repeat(90));

for (let i = 0; i < produkty.length; i++) {
  const p = produkty[i];
  process.stdout.write(`\r[${i+1}/${produkty.length}] ${p.nazwa.slice(0,40).padEnd(40)}`);

  const found = await searchProduct(p.nazwa);

  const status = !found ? "BRAK" : Math.abs(found.price - p.cena_netto) < 0.01 ? "OK" : "ZMIANA";
  results.push({ nazwa: p.nazwa, stara: p.cena_netto, nowa: found?.price ?? null, matched: found?.matched ?? null, score: found?.score ?? 0, status });

  if (status !== "OK") {
    const nowaCena = found ? `${found.price} zł` : "—";
    const diff = found ? ` (${found.price > p.cena_netto ? "+" : ""}${(found.price - p.cena_netto).toFixed(2)})` : "";
    console.log(`\n[${status.padEnd(6)}] ${p.nazwa.slice(0,45).padEnd(45)} | było: ${String(p.cena_netto).padStart(5)} | teraz: ${nowaCena}${diff}`);
    if (found) console.log(`         dopasowano do: ${found.matched} (${Math.round(found.score*100)}%)`);
  }
}

console.log("\n" + "─".repeat(90));

const ok      = results.filter(r => r.status === "OK").length;
const zmiana  = results.filter(r => r.status === "ZMIANA").length;
const brak    = results.filter(r => r.status === "BRAK").length;

console.log(`\n📊 WYNIKI (${LIMIT} produktów, BEZ zapisu do bazy):`);
console.log(`   ✅ Cena się zgadza:     ${ok}`);
console.log(`   🔄 Cena do zmiany:      ${zmiana}`);
console.log(`   ❌ Nie znaleziono:      ${brak}`);
console.log(`\n⚠️  Sprawdź kilkanaście "ZMIANA" w zamawiarce i potwierdź czy nowe ceny są poprawne.`);
console.log(`   Jeśli OK → odpalisz scripts/scrape-all-prices.mjs dla wszystkich produktów.\n`);

writeFileSync("test-prices-result.json", JSON.stringify(results, null, 2));
console.log("Zapisano szczegóły: test-prices-result.json");

await browser.close();
