/**
 * Czyta strukturę słowników z IndexedDB selliTem
 */
import { chromium } from "playwright";
import { writeFileSync, readFileSync } from "fs";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";

const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext();
const page = await ctx.newPage();

// Logowanie
await page.goto(BASE + "/web/login", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
if (await page.$("input[type=password]")) {
  const u = await page.$("input[type=text], input[name*=user]");
  if (u) await u.fill(LOGIN);
  await page.fill("input[type=password]", PASS);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
}

// Poczekaj aż TsmDatabase.products ma dane
async function readStore(dbName, storeName) {
  return await page.evaluate(({ dbName, storeName }) => {
    return new Promise((resolve) => {
      const req = indexedDB.open(dbName);
      req.onerror = () => resolve([]);
      req.onsuccess = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) { db.close(); resolve([]); return; }
        const tx = db.transaction(storeName, "readonly");
        const all = tx.objectStore(storeName).getAll();
        all.onsuccess = (ev) => { db.close(); resolve(ev.target.result); };
        all.onerror   = () => { db.close(); resolve([]); };
      };
    });
  }, { dbName, storeName });
}

// Czekaj aż produkty będą
let tries = 0;
while (tries++ < 40) {
  const p = await readStore("TsmDatabase", "products");
  if (p.length > 0) break;
  process.stdout.write(`Czekam na sync... ${tries}\r`);
  await page.waitForTimeout(5000);
}

const groups  = await readStore("TsmDatabase", "productGroups");
const units   = await readStore("TsmDatabase", "units");
const mfrs    = await readStore("TsmDatabase", "manufacturers");
const products = await readStore("TsmDatabase", "products");

console.log("\n=== productGroups (pierwsze 3) ===");
console.log(JSON.stringify(groups.slice(0, 3), null, 2));

console.log("\n=== units (wszystkie) ===");
console.log(JSON.stringify(units, null, 2));

console.log("\n=== product[0] groupId/unitId ===");
const p0 = products[0] || {};
console.log("groupId:", p0.groupId, "unitId:", p0.unitId, "manufacturerId:", p0.manufacturerId);

console.log("\n=== manufacturer[0] ===");
console.log(JSON.stringify(mfrs[0], null, 2));

writeFileSync("scripts/debug-idb.json", JSON.stringify({
  groups: groups.slice(0, 10),
  units,
  mfrs: mfrs.slice(0, 5),
  sample_products: products.slice(0, 3)
}, null, 2));
console.log("\nZapisano do scripts/debug-idb.json");
await browser.close();
