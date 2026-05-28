/**
 * Naprawia złe ceny (kaucje DRS ≤ 0.50 zł) i uzupełnia brakujące ceny z price-map.json
 * Uruchom: cd fruit && node scripts/fix-prices.mjs
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);
const pm = JSON.parse(readFileSync(new URL("../price-map.json", import.meta.url), "utf-8"));

// Pobierz wszystkie produkty
console.log("Pobieranie produktów z Supabase...");
const all = [];
let from = 0;
while (true) {
  const { data, error } = await supabase.from("produkty").select("id, nazwa, cena_netto").range(from, from + 999);
  if (error || !data || data.length === 0) break;
  all.push(...data);
  if (data.length < 1000) break;
  from += 1000;
}
console.log(`Pobrano: ${all.length} produktów`);

// Matching — ta sama logika co w scrape-all-prices
function wordsOf(s) {
  return new Set(s.toUpperCase().replace(/[.,\-\/]/g, " ").split(/\s+/).filter(w => w.length > 2));
}
function overlap(a, b) {
  const wa = wordsOf(a), wb = wordsOf(b);
  let n = 0;
  for (const w of wa) if (wb.has(w)) n++;
  return n;
}
const pmEx = { ...pm };
for (const [k, v] of Object.entries(pm)) {
  const noSuffix = k.replace(/\/\d[^\s]*$/, "").trim();
  if (noSuffix !== k && !pmEx[noSuffix]) pmEx[noSuffix] = v;
}
const pmKeys = Object.keys(pmEx);

function findPrice(nazwa) {
  const key = nazwa.trim().replace(/^\*+/, "").trim().toUpperCase();
  if (pmEx[key] !== undefined) return pmEx[key];
  if (key.length >= 8) {
    const hit = pmKeys.find(k => k.startsWith(key));
    if (hit) return pmEx[hit];
  }
  if (key.length >= 8) {
    const hit = pmKeys.find(k => k.length >= 8 && key.startsWith(k));
    if (hit) return pmEx[hit];
  }
  let bestKey = null, bestScore = 0;
  for (const k of pmKeys) {
    const s = overlap(key, k);
    if (s > bestScore) { bestScore = s; bestKey = k; }
  }
  if (bestScore >= 3) return pmEx[bestKey];
  return null;
}

// Produkty do naprawy: cena ≤ 0.50 lub brak ceny
const toFix = all.filter(p => !p.cena_netto || p.cena_netto <= 0.5);
console.log(`\nProduktów do naprawy: ${toFix.length}`);

const updates = [];
let matched = 0, noMatch = 0;
for (const p of toFix) {
  const price = findPrice(p.nazwa || "");
  if (price !== null) { updates.push({ id: p.id, cena_netto: price }); matched++; }
  else { updates.push({ id: p.id, cena_netto: null }); noMatch++; }
}
console.log(`Dopasowano z price-map: ${matched}`);
console.log(`Bez dopasowania → "Zapytaj o ofertę": ${noMatch}`);

const CONC = 20;
let saved = 0;
for (let i = 0; i < updates.length; i += CONC) {
  const batch = updates.slice(i, i + CONC);
  await Promise.all(batch.map(u =>
    supabase.from("produkty").update({ cena_netto: u.cena_netto }).eq("id", u.id)
  ));
  saved += batch.length;
  process.stdout.write(`\r  Zaktualizowano: ${saved}/${updates.length}`);
}

console.log(`\n\n✅ Gotowe — poprawiono ${updates.length} produktów`);
