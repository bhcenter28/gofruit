/**
 * Aktualizuje kategorie, jednostki i producentów w Supabase
 * Uruchom po pełnym sync selliTem
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
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

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
  await page.waitForTimeout(3000);
}

async function readStore(storeName) {
  return await page.evaluate((storeName) => {
    return new Promise((resolve) => {
      const req = indexedDB.open("TsmDatabase");
      req.onerror = () => resolve([]);
      req.onsuccess = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) { db.close(); resolve([]); return; }
        const all = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
        all.onsuccess = (ev) => { db.close(); resolve(ev.target.result); };
        all.onerror   = () => { db.close(); resolve([]); };
      };
    });
  }, storeName);
}

// Czekaj aż produkty i grupy będą załadowane
console.log("Czekam na sync (grupy i produkty)...");
let groups = [], units = [], mfrs = [], products = [];
const deadline = Date.now() + 15 * 60 * 1000;
while (Date.now() < deadline) {
  [groups, units, mfrs, products] = await Promise.all([
    readStore("productGroups"),
    readStore("units"),
    readStore("manufacturers"),
    readStore("products"),
  ]);
  if (groups.length > 0 && products.length > 1000) break;
  process.stdout.write(`  products:${products.length} groups:${groups.length} units:${units.length}\r`);
  await page.waitForTimeout(10000);
}

console.log(`\nZaładowano: products:${products.length} groups:${groups.length} units:${units.length} mfrs:${mfrs.length}`);

// Pokaż strukturę grupy
if (groups.length > 0) {
  console.log("\nPrzykładowa grupa:", JSON.stringify(groups[0]));
}
if (units.length > 0) {
  console.log("Przykładowa jednostka:", JSON.stringify(units[0]));
}

// Buduj mapy — użyj String() żeby uniknąć type mismatch
const groupMap = {};
for (const g of groups) {
  const key = String(g.groupId ?? g.id ?? g.rowId ?? "");
  const name = g.groupName || g.name || g.longName || g.nazwa || "";
  if (key && name) groupMap[key] = name;
}
const unitMap = {};
for (const u of units) {
  const key = String(u.id ?? u.rowId ?? "");
  const name = u.name || u.shortName || u.nazwa || "szt";
  if (key) unitMap[key] = name;
}
const mfrMap = {};
for (const m of mfrs) {
  const key = String(m.id ?? m.rowId ?? "");
  const name = m.name || m.nazwa || "";
  if (key && name) mfrMap[key] = name;
}

console.log(`\nMapy: groups:${Object.keys(groupMap).length} units:${Object.keys(unitMap).length} mfrs:${Object.keys(mfrMap).length}`);

// Pokaż sample mapowania
const sample = products[0];
if (sample) {
  console.log(`\nProduct[0] groupId:${sample.groupId} → "${groupMap[String(sample.groupId)]}"`);
  console.log(`Product[0] unitId:${sample.unitId}  → "${unitMap[String(sample.unitId)]}"`);
}

// Aktualizuj produkty w Supabase partiami
console.log("\nAktualizuję kategorie w Supabase...");
const updates = products.map(p => ({
  indeks_erp: String(p.id),
  kategoria: groupMap[String(p.groupId)] || null,
  jednostka: unitMap[String(p.unitId)] || "szt",
  znacznik: mfrMap[String(p.manufacturerId)] || null,
})).filter(u => u.kategoria || u.znacznik);

console.log(`Rekordów do aktualizacji: ${updates.length}`);

let updated = 0;
const BATCH = 200;
for (let i = 0; i < updates.length; i += BATCH) {
  const batch = updates.slice(i, i + BATCH);
  // Aktualizuj przez indeks_erp
  for (const u of batch) {
    const { error } = await supabase
      .from("produkty")
      .update({ kategoria: u.kategoria, jednostka: u.jednostka, znacznik: u.znacznik })
      .eq("indeks_erp", u.indeks_erp);
    if (error) process.stdout.write(`x`);
    else updated++;
  }
  process.stdout.write(`  ${updated}/${updates.length}\r`);
}
console.log(`\n✅ Zaktualizowano ${updated} produktów`);

// Sprawdź wynik
const { data } = await supabase
  .from("produkty")
  .select("kategoria")
  .not("kategoria", "is", null)
  .limit(1);
console.log("Przykładowa kategoria w DB:", data?.[0]?.kategoria);

await browser.close();
