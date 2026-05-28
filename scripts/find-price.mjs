/**
 * Znajdź skąd pochodzi cena 2.24 dla produktu id:3 (3 BIT BATON 46G)
 * Uruchom: node scripts/find-price.mjs
 */
import { chromium } from "playwright";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";

const browser = await chromium.launch({ headless: false });
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
  if (count === lastCount && count > 1000) {
    stable++;
    if (stable >= 3) break;
  } else { stable = 0; }
  lastCount = count;
  process.stdout.write(`  products:${count} stable:${stable}/3\r`);
}
console.log(`\nSync done: ${lastCount} products`);

// Wylistuj wszystkie store'y
const storeNames = await page.evaluate(() => new Promise(resolve => {
  const r = indexedDB.open("TsmDatabase");
  r.onsuccess = e => {
    const names = Array.from(e.target.result.objectStoreNames);
    e.target.result.close();
    resolve(names);
  };
  r.onerror = () => resolve([]);
}));
console.log("\nWszystkie store'y w TsmDatabase:");
storeNames.forEach(n => console.log("  -", n));

// Szukaj wartości bliskiej 2.24 w każdym store
console.log("\nSzukam 2.24 we wszystkich store'ach...");
for (const storeName of storeNames) {
  const records = await page.evaluate((s) => new Promise(resolve => {
    const r = indexedDB.open("TsmDatabase");
    r.onsuccess = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(s)) { db.close(); resolve([]); return; }
      const t = db.transaction(s, "readonly").objectStore(s).getAll();
      t.onsuccess = ev => { db.close(); resolve(ev.target.result); };
      t.onerror = () => { db.close(); resolve([]); };
    };
    r.onerror = () => resolve([]);
  }), storeName).catch(() => []);

  // Sprawdź czy jakiś rekord zawiera productId=3 lub wartość ~2.24
  const hits = records.filter(r => {
    if (!r || typeof r !== "object") return false;
    const str = JSON.stringify(r);
    return str.includes('"productId":3') || str.includes('"id":3') ||
           str.includes('2.24') || str.includes('2.2395') || str.includes('2.239');
  });

  if (hits.length > 0) {
    console.log(`\n✅ ZNALEZIONO w "${storeName}" (${hits.length} rekordów):`);
    hits.slice(0, 3).forEach(h => console.log(JSON.stringify(h, null, 2)));
  } else if (records.length > 0) {
    console.log(`   "${storeName}": ${records.length} rekordów — brak trafień`);
    // Pokaż przykład struktury
    if (records[0] && typeof records[0] === "object") {
      const keys = Object.keys(records[0]).slice(0, 8);
      console.log(`     klucze: ${keys.join(", ")}`);
    }
  }
}

await browser.close();
