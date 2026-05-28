import { chromium } from "playwright";

const BASE = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT", PASS = "Hubert2026";

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
  await page.waitForTimeout(8000);
}

async function readStorePartial(storeName, limit=3) {
  return await page.evaluate(({ s, l }) => new Promise(resolve => {
    const req = indexedDB.open("TsmDatabase");
    req.onerror = () => resolve([]);
    req.onsuccess = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(s)) { db.close(); resolve([]); return; }
      const results = [];
      const cursor = db.transaction(s,"readonly").objectStore(s).openCursor();
      cursor.onsuccess = ev => {
        const c = ev.target.result;
        if (!c || results.length >= l) { db.close(); resolve(results); return; }
        results.push(c.value);
        c.continue();
      };
      cursor.onerror = () => { db.close(); resolve(results); };
    };
  }), { s: storeName, l: limit });
}

// Czekaj na sync
let tries = 0;
while (tries++ < 30) {
  const p = await readStorePartial("products", 1);
  if (p.length > 0) break;
  await page.waitForTimeout(5000);
  process.stdout.write(`wait ${tries}\r`);
}

// Sprawdź images store
console.log("\n=== images store (3 rekordy) ===");
const imgs = await readStorePartial("images", 3);
console.log(JSON.stringify(imgs, null, 2));

// Sprawdź też czy jest URL w network requests podczas ładowania produktu
console.log("\n=== catalogImagesData[0] ===");
const catImgs = await readStorePartial("catalogImagesData", 1);
console.log(JSON.stringify(catImgs[0]));

await browser.close();
