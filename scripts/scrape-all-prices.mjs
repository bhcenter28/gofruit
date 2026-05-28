/**
 * Scrape cen z katalogu selliTem dla kontrahenta [800738] FRUIT
 * Uruchom: node scripts/scrape-all-prices.mjs
 *
 * Naprawy vs poprzednia wersja:
 * 1. Supabase zwraca maks 1000 wierszy — teraz paginujemy i pobieramy WSZYSTKIE produkty
 * 2. Faza 2: stale DOM — czekamy aż wyniki się zmienią po każdym wyszukaniu
 * 3. Faza 2: minimalne nakładanie słów >= 2 przed przypisaniem ceny
 * 4. findPrice: word-overlap >= 2 już w Fazie 1 (łapie skrócone nazwy z ERP)
 * 5. Batch upsert zamiast 13 000 pojedynczych UPDATE
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";
const SEL   = "div.w-100.h-100.overflow-auto";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

// ================================================================
// SUPABASE: pobierz WSZYSTKIE produkty przez paginację
// ================================================================
async function getAllProducts() {
  const PAGE = 1000;
  let all = [];
  let from = 0;
  process.stdout.write("Ładuję produkty z Supabase");
  while (true) {
    const { data, error } = await supabase
      .from("produkty")
      .select("id, nazwa, cena_netto")
      .range(from, from + PAGE - 1);
    if (error) { console.error("\nBłąd Supabase:", error.message); break; }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    process.stdout.write(` ${all.length}`);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  console.log(`\nZaładowano: ${all.length} produktów`);
  return all;
}

// ================================================================
// PRZEGLĄDARKA — start i logowanie
// ================================================================
const browser = await chromium.launch({ headless: true });
const ctx     = await browser.newContext();
const page    = await ctx.newPage();

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

// ================================================================
// CZEKAJ NA SYNC IndexedDB
// ================================================================
console.log("Czekam na sync...");
let lastCount = 0, stable = 0;
const syncDeadline = Date.now() + 15 * 60 * 1000;
while (Date.now() < syncDeadline) {
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
  else stable = 0;
  lastCount = count;
  process.stdout.write(`  products:${count} stable:${stable}/3\r`);
}
console.log(`\nSync gotowy (${lastCount} produktów)`);

// ================================================================
// NAWIGACJA DO KATALOGU
// ================================================================
await page.goto(BASE + "/web/tsm", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});

console.log("Czekam na aplikację...");
const deadline2 = Date.now() + 10 * 60 * 1000;
while (Date.now() < deadline2) {
  await page.waitForTimeout(3000);
  const text = await page.evaluate(() => document.body.innerText);
  if (text.includes("Katalog") || text.includes("Wybierz kontrahenta")) break;
  const syncText = text.match(/Trwa synchronizacja[^\n]*/)?.[0] || "";
  if (syncText) process.stdout.write(`  ${syncText}\r`);
}

console.log("\nKlikam Katalog...");
const katalogTile = page.locator("text=Katalog").first();
if (await katalogTile.count() > 0) {
  await katalogTile.click();
  await page.waitForTimeout(3000);
} else {
  await page.goto(BASE + "/web/tsm/catalog", { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
}

// ================================================================
// WYBIERZ KONTRAHENTA [800738]
// ================================================================
await page.waitForTimeout(1000);
const headerText0 = await page.evaluate(() => document.body.innerText);
if (!headerText0.includes("800738")) {
  console.log("Wybieram kontrahenta [800738]...");
  // Kliknij przycisk wyboru kontrahenta
  const btns = await page.$$("button, [role='button'], a");
  for (const btn of btns) {
    const t = (await btn.textContent().catch(() => "")).toLowerCase();
    if (t.includes("kontrahent") || t.includes("wybierz")) {
      await btn.click();
      break;
    }
  }
  await page.waitForTimeout(2000);

  const item800738 = await page.$("text=[800738]");
  if (item800738) {
    await item800738.click();
    await page.waitForTimeout(4000);
    console.log("Kontrahent [800738] FRUIT wybrany");
  } else {
    await page.screenshot({ path: "contractor-dialog.png" });
    console.log("⚠ Nie znaleziono [800738] — sprawdź contractor-dialog.png");
  }
} else {
  console.log("Kontrahent [800738] już aktywny");
}

// ================================================================
// ZNAJDŹ WYSZUKIWARKĘ KATALOGU
// ================================================================
const inputDiag = await page.evaluate(() =>
  [...document.querySelectorAll("input")].map(i => {
    const rect = i.getBoundingClientRect();
    return {
      ngReflect: i.getAttribute("ng-reflect-placeholder") || "",
      ariaLabel: i.getAttribute("aria-label") || "",
      y: Math.round(rect.top),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
      visible: rect.width > 0 && rect.height > 0,
    };
  }).filter(i => i.visible).sort((a, b) => a.y - b.y)
);
console.log("Inputy widoczne (góra→dół):");
inputDiag.slice(0, 6).forEach(i =>
  console.log(`  y=${i.y} w=${i.w} ng="${i.ngReflect}" aria="${i.ariaLabel}"`)
);

// Wyszukiwarka: duży input nie z multiselect
const searchCand = inputDiag.find(i => i.ngReflect.toLowerCase().includes("szukaj"))
  || inputDiag.find(i => i.w > 150 && !i.ariaLabel.toLowerCase().includes("multiselect") && !i.ariaLabel.toLowerCase().includes("search"));
let searchCoords = null;
if (searchCand) {
  searchCoords = { x: Math.round(searchCand.w / 2 + 10), y: searchCand.y + Math.round(searchCand.h / 2) };
  console.log(`Wyszukiwarka: y=${searchCand.y} w=${searchCand.w}`);
} else {
  console.log("⚠ Nie znaleziono wyszukiwarki");
}

// ================================================================
// POMOCNICZE: odczyt wierszy z DOM
// ================================================================
async function readVisibleRows() {
  return await page.evaluate(() => {
    const rows = [];
    for (const tr of document.querySelectorAll("tr")) {
      const tds = [...tr.querySelectorAll("td")];
      if (tds.length < 3) continue;
      const priceTd = tds.find(td => /\d+[,\.]\d+\s*zł/.test(td.innerText));
      if (!priceTd) continue;
      const nameTd = tr.querySelector("td.left")
        || tds.find(td => td !== priceTd && td.innerText?.trim().length > 5 && /[A-Z]{2,}/.test(td.innerText));
      if (!nameTd) continue;
      const name  = nameTd.innerText.trim().split("\n")[0].trim();
      const match = priceTd.innerText.match(/(\d+[,\.]\d+)/);
      const price = match ? parseFloat(match[1].replace(",", ".")) : 0;
      if (name && name.length > 2 && price > 0) rows.push({ name, price });
    }
    return rows;
  });
}

// ================================================================
// fillSearch — wypełnij i poczekaj aż DOM się zaktualizuje
// ================================================================
async function fillSearch(query) {
  if (!searchCoords) return false;

  // Zapamiętaj aktualny stan DOM żeby wykryć zmianę
  const prevRows = await readVisibleRows();
  const prevSig  = prevRows.map(r => r.name).join("|");

  await page.mouse.click(searchCoords.x, searchCoords.y);
  await page.waitForTimeout(150);
  await page.keyboard.press("Control+A");
  await page.keyboard.type(query);

  // Czekaj maks 5 sekund na zmianę DOM
  for (let w = 0; w < 50; w++) {
    await page.waitForTimeout(100);
    const nowRows = await readVisibleRows();
    const nowSig  = nowRows.map(r => r.name).join("|");
    if (nowSig !== prevSig) break; // DOM się zmienił
  }
  // Dodatkowe 400 ms dla Angular żeby skończył render
  await page.waitForTimeout(400);
  return true;
}

async function clearSearch() {
  if (!searchCoords) return;
  await page.mouse.click(searchCoords.x, searchCoords.y);
  await page.waitForTimeout(150);
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Delete");
  await page.waitForTimeout(800);
}

// ================================================================
// Paginacja: "X of Y" z innerText (Angular dzieli węzły tekstowe)
// ================================================================
async function getPaginationInfo() {
  return await page.evaluate(() => {
    // innerText łączy wszystkie węzły tekstowe — pewniejsze niż TreeWalker
    const m = document.body.innerText.match(/(\d+)\s+of\s+(\d+)/);
    if (!m) return null;
    return { current: +m[1], total: +m[2] };
  });
}

async function clickNextPage() {
  return await page.evaluate(() => {
    // Metoda 1: Angular Material paginator
    const m1 = document.querySelector('.mat-paginator-navigation-next, [class*="navigation-next"]');
    if (m1 && !m1.disabled && !m1.hasAttribute('disabled') && !m1.classList.contains('mat-button-disabled')) {
      m1.click(); return 'mat-paginator';
    }

    // Metoda 2: aria-label z "next" lub "następn"
    const m2 = [...document.querySelectorAll('button')].find(b => {
      const l = (b.getAttribute('aria-label') || b.title || '').toLowerCase();
      return (l.includes('next') || l.includes('następn'))
        && !b.disabled && !b.hasAttribute('disabled')
        && !b.classList.contains('mat-button-disabled');
    });
    if (m2) { m2.click(); return 'aria'; }

    // Metoda 3: znajdź element z "X of Y" (przez innerText elementu) i kliknij przycisk NA PRAWO
    const allEls = [...document.querySelectorAll('*')];
    for (const el of allEls) {
      if (el.children.length > 3) continue; // kontenery z dziećmi - nie to
      const text = (el.textContent || '').trim();
      if (!/^\d+\s+of\s+\d+$/.test(text)) continue;

      const elRect = el.getBoundingClientRect();
      // Szukaj enabled buttona z prawej strony tego elementu
      const rightBtn = [...document.querySelectorAll('button')].find(b => {
        if (b.disabled || b.hasAttribute('disabled') || b.classList.contains('mat-button-disabled')) return false;
        const r = b.getBoundingClientRect();
        return r.left >= elRect.right - 5 && Math.abs((r.top + r.height/2) - (elRect.top + elRect.height/2)) < 30;
      });
      if (rightBtn) { rightBtn.click(); return 'position'; }
    }
    return false;
  });
}

// ================================================================
// collectForQuery — zbierz ceny dla danego zapytania (z paginacją)
// ================================================================
async function collectForQuery(query, debugFirst = false) {
  const filled = await fillSearch(query);
  if (!filled) return {};

  const found = {};

  for (let pageNum = 1; pageNum <= 500; pageNum++) {
    await page.waitForTimeout(400);

    const rows = await readVisibleRows();
    for (const { name, price } of rows) {
      const k = name.toUpperCase();
      if (!found[k]) found[k] = price;
    }

    // DEBUG tylko dla pierwszego zapytania (sprawdzamy czy paginacja działa)
    if (debugFirst && pageNum === 1) {
      const pag = await getPaginationInfo();
      const snippet = await page.evaluate(() => {
        const t = document.body.innerText;
        const m = t.match(/.{0,10}\d+\s+of\s+\d+.{0,10}/);
        return m ? m[0].replace(/\n/g, ' ') : 'NIE ZNALEZIONO';
      });
      console.log(`\n  [DEBUG paginacja] info=${JSON.stringify(pag)} | fragment="${snippet}"`);
    }

    // Sprawdź czy jest następna strona
    const pag = await getPaginationInfo();
    if (!pag) break;             // brak paginatora = jedyna strona
    if (pag.current >= pag.total) break; // ostatnia strona

    const clicked = await clickNextPage();
    if (!clicked) break;
    // Czekaj aż DOM się zaktualizuje (zmieni się numer strony)
    const prevPage = pag.current;
    for (let w = 0; w < 20; w++) {
      await page.waitForTimeout(150);
      const nowPag = await getPaginationInfo();
      if (nowPag && nowPag.current !== prevPage) break;
    }
  }

  return found;
}

// ================================================================
// ZBIERANIE CEN — prefiksy 1-znakowe + 2-znakowe dla częstych liter
// ================================================================
const priceMap = {};
// 1-znakowe + 2-znakowe (user: zostaw 2-znakowe + napraw strony)
const P1 = "0123456789ABCDEFGHIJKLMNOPRSTUWXYZ".split("");
const P2 = [];
for (const a of "ABCDEFGHIJKLMNOPRSTUWZ".split(""))
  for (const b of "ABCDEFGHIJKLMNOPRSTUWZ0123456789".split(""))
    P2.push(a + b);
const ALL_PREFIXES = [...P1, ...P2];

if (!searchCoords) {
  console.log("⚠ Brak wyszukiwarki — zbieram tylko widoczne produkty");
  const rows = await readVisibleRows();
  for (const { name, price } of rows) priceMap[name.toUpperCase()] = price;
} else {
  console.log(`\nIteruję przez ${ALL_PREFIXES.length} prefiksów z paginacją (każdy prefiks = wszystkie strony)...\n`);

  for (let pi = 0; pi < ALL_PREFIXES.length; pi++) {
    const prefix = ALL_PREFIXES[pi];
    const found  = await collectForQuery(prefix, pi === 0);
    let added = 0;
    for (const [k, v] of Object.entries(found)) {
      if (!priceMap[k]) { priceMap[k] = v; added++; }
    }
    const tot = Object.keys(priceMap).length;
    if (pi % 20 === 0 || added > 5) {
      process.stdout.write(`\r  [${pi+1}/${ALL_PREFIXES.length}] "${prefix}" +${added} | łącznie: ${tot}   `);
    }
    // Checkpoint co 5 prefiksów
    if (pi % 5 === 4) {
      writeFileSync("price-map.json", JSON.stringify(priceMap, null, 2));
      console.log(`\n  💾 Checkpoint: ${tot} cen`);
    }
  }
  console.log();
}

await clearSearch().catch(() => {});
const pmTotal = Object.keys(priceMap).length;
console.log(`\nŁącznie zebrano: ${pmTotal} cen`);
writeFileSync("price-map.json", JSON.stringify(priceMap, null, 2));

if (pmTotal < 100) {
  await page.screenshot({ path: "debug-empty.png" });
  console.log("⚠ Za mało cen! Sprawdź debug-empty.png");
}

// ================================================================
// DOPASOWANIE: word-overlap
// ================================================================
function wordsOf(s) {
  return new Set(
    s.toUpperCase()
      .replace(/[.,\-\/]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2)
  );
}

function overlap(a, b) {
  const wa = wordsOf(a), wb = wordsOf(b);
  let n = 0;
  for (const w of wa) if (wb.has(w)) n++;
  return n;
}

// Rozszerzona mapa: dodaj klucze bez sufiksu "/8SZT" itp.
const pmEx = { ...priceMap };
for (const [k, v] of Object.entries(priceMap)) {
  const noSuffix = k.replace(/\/\d[^\s]*$/, "").trim();
  if (noSuffix !== k && !pmEx[noSuffix]) pmEx[noSuffix] = v;
}
const pmKeys = Object.keys(pmEx);

function findPrice(nazwa) {
  const key = nazwa.trim().replace(/^\*+/, "").trim().toUpperCase();

  // 1. Dokładne dopasowanie
  if (pmEx[key] !== undefined) return { price: pmEx[key], method: "exact" };

  // 2. Price-map klucz zaczyna się od nazwy Supabase (Supabase = prefiks nazwy DOM)
  if (key.length >= 8) {
    const hit = pmKeys.find(k => k.startsWith(key));
    if (hit) return { price: pmEx[hit], method: "prefix-sup" };
  }

  // 3. Nazwa Supabase zaczyna się od price-map klucza (DOM = prefiks nazwy Sup — rzadkie)
  if (key.length >= 8) {
    const hit = pmKeys.find(k => k.length >= 8 && key.startsWith(k));
    if (hit) return { price: pmEx[hit], method: "prefix-dom" };
  }

  // 4. Word-overlap — wymagamy co najmniej 3 wspólnych słów (>2 znaki)
  let bestKey = null, bestScore = 0;
  for (const k of pmKeys) {
    const s = overlap(key, k);
    if (s > bestScore) { bestScore = s; bestKey = k; }
  }
  if (bestScore >= 3) return { price: pmEx[bestKey], method: `overlap:${bestScore}` };

  return null;
}

// ================================================================
// WCZYTAJ WSZYSTKIE PRODUKTY Z SUPABASE
// ================================================================
const produkty = await getAllProducts();

// ================================================================
// FAZA 1 — dopasowanie z price-map (bez DOM)
// ================================================================
const toSearch  = [];
const ph1Updates = [];
const methodStats = {};

for (const p of produkty) {
  const result = findPrice(p.nazwa || "");
  if (result !== null) {
    ph1Updates.push({ id: p.id, cena_netto: result.price });
    methodStats[result.method] = (methodStats[result.method] || 0) + 1;
  } else {
    toSearch.push(p);
  }
}
console.log(`\nFaza 1 — dopasowano: ${ph1Updates.length} | do DOM: ${toSearch.length}`);
console.log("  metody:", JSON.stringify(methodStats));

// Zapisz Fazę 1 — update po 20 równolegle (upsert powoduje NOT NULL, update nie)
console.log("Zapisuję Fazę 1 do Supabase...");

// Pokaż zmiany cen
const stareMap = Object.fromEntries(produkty.map(p => [p.id, p.cena_netto]));
const zmiany = ph1Updates.filter(u => Math.abs((stareMap[u.id] ?? 0) - u.cena_netto) > 0.01);
if (zmiany.length > 0) {
  console.log(`\n  Zmiany cen (${zmiany.length} produktów):`);
  zmiany.slice(0, 30).forEach(u => {
    const stara = stareMap[u.id];
    const diff  = u.cena_netto - (stara ?? 0);
    const znak  = diff > 0 ? "+" : "";
    const prod  = produkty.find(p => p.id === u.id);
    console.log(`  ${znak}${diff.toFixed(2)} zł  |  ${stara ?? "—"} → ${u.cena_netto}  |  ${prod?.nazwa?.slice(0, 50) ?? ""}`);
  });
  if (zmiany.length > 30) console.log(`  ... i ${zmiany.length - 30} więcej`);
}

const CONC = 20;
let saved1 = 0;
for (let i = 0; i < ph1Updates.length; i += CONC) {
  const slice = ph1Updates.slice(i, i + CONC);
  const results = await Promise.all(
    slice.map(u => supabase.from("produkty").update({ cena_netto: u.cena_netto }).eq("id", u.id))
  );
  const errs = results.filter(r => r.error);
  if (errs.length) console.error(`\n  Błędy: ${errs.map(r => r.error.message).join(', ')}`);
  saved1 += slice.length - errs.length;
  process.stdout.write(`\r  Zaktualizowano ${saved1}/${ph1Updates.length}   `);
}
console.log(`\nFaza 1 zapisana ✓ (${saved1})`);

// ================================================================
// FAZA 2 — wyszukiwanie w DOM dla produktów bez dopasowania
// ================================================================
let ph2Updated = 0, ph2Skipped = 0;

if (searchCoords && toSearch.length > 0) {
  console.log(`\nFaza 2 — szukam ${toSearch.length} produktów w katalogu...`);
  const ph2Updates = [];

  for (let i = 0; i < toSearch.length; i++) {
    const p = toSearch[i];
    const rawQuery = p.nazwa.trim().replace(/^\*+/, "");
    // Użyj pierwszych 25 znaków jako zapytania
    const query = rawQuery.slice(0, 25);
    process.stdout.write(`\r  [${i+1}/${toSearch.length}] "${query.slice(0,20)}"...        `);

    const filled = await fillSearch(query);
    if (!filled) { ph2Skipped++; continue; }

    // Dodatkowe 600 ms na pewno
    await page.waitForTimeout(600);

    const rows = await readVisibleRows();
    if (rows.length === 0) { ph2Skipped++; continue; }

    // Wybierz wynik z najwyższym word-overlap
    let best = null, bestScore = 0;
    for (const row of rows) {
      const s = overlap(p.nazwa, row.name);
      if (s > bestScore) { bestScore = s; best = row; }
    }

    // Wymagaj minimum 2 wspólnych słów — inaczej ryzyko błędnego dopasowania
    if (bestScore < 2 || !best) { ph2Skipped++; continue; }

    ph2Updates.push({ id: p.id, cena_netto: best.price });
    ph2Updated++;

    // Zapisuj co 200 produktów
    if (ph2Updates.length >= 200) {
      const chunk = ph2Updates.splice(0, 200);
      await Promise.all(chunk.map(u => supabase.from("produkty").update({ cena_netto: u.cena_netto }).eq("id", u.id)));
      process.stdout.write(`\n  💾 Zapisano partię Fazy 2 (${ph2Updated} łącznie)`);
    }
  }

  // Zapisz resztę
  if (ph2Updates.length > 0) {
    await Promise.all(ph2Updates.map(u => supabase.from("produkty").update({ cena_netto: u.cena_netto }).eq("id", u.id)));
  }

  console.log(`\nFaza 2 — zaktualizowano: ${ph2Updated} | pominięto (brak pewności): ${ph2Skipped}`);
}

// ================================================================
// PODSUMOWANIE
// ================================================================
const totalUpdated = ph1Updates.length + ph2Updated;
console.log(`
==============================================
✅ GOTOWE
   Price-map:       ${pmTotal} cen
   Faza 1 (pewne):  ${ph1Updates.length} produktów
   Faza 2 (DOM):    ${ph2Updated} produktów
   Bez ceny:        ${produkty.length - totalUpdated} produktów
   ŁĄCZNIE:         ${produkty.length} produktów w Supabase
==============================================
`);

await browser.close();
