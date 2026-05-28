/**
 * Znajdź URL zdjęć — uruchom PO pełnym sync selliTem
 * Uruchom: cd fruit && node scripts/check-photos.mjs
 */
import { chromium } from "playwright";
import { writeFileSync } from "fs";

const BASE  = "https://sellitemhtm.ihurt.pl";
const LOGIN = "HUBERT";
const PASS  = "Hubert2026";

const browser = await chromium.launch({ headless: false, slowMo: 20 });
const ctx  = await browser.newContext();
const page = await ctx.newPage();

// Przechwytuj requesty od startu
const imageRequests = [];
page.on("request", req => {
  const url = req.url();
  if (/image|photo|thumb|catalog|\.jpg|\.png|\.webp|blob/i.test(url))
    imageRequests.push(url);
});
page.on("response", async resp => {
  const url = resp.url();
  const ct  = resp.headers()["content-type"] || "";
  if (ct.startsWith("image/")) {
    imageRequests.push(`[IMG ${ct}] ${url}`);
  }
});

await page.goto(BASE + "/web/login", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
if (await page.$("input[type=password]")) {
  const u = await page.$("input[type=text], input[name*=user]");
  if (u) await u.fill(LOGIN);
  await page.fill("input[type=password]", PASS);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
}

// Czekaj na sync (maks 15 min)
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

// Sprawdź ile jest w images store
const imgCount = await page.evaluate(() => new Promise(res => {
  const r = indexedDB.open("TsmDatabase");
  r.onsuccess = e => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("images")) { db.close(); res(-1); return; }
    const t = db.transaction("images","readonly").objectStore("images").count();
    t.onsuccess = ev => { db.close(); res(ev.target.result); };
  };
}));
console.log(`Images store: ${imgCount} rekordów`);

const catImgCount = await page.evaluate(() => new Promise(res => {
  const r = indexedDB.open("TsmDatabase");
  r.onsuccess = e => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("catalogImagesData")) { db.close(); res(-1); return; }
    const t = db.transaction("catalogImagesData","readonly").objectStore("catalogImagesData").count();
    t.onsuccess = ev => { db.close(); res(ev.target.result); };
  };
}));
console.log(`CatalogImagesData store: ${catImgCount} rekordów`);

// Przejdź do katalogu
await page.goto(BASE + "/web/tsm", { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(3000);
const katalog = page.locator("text=Katalog").first();
if (await katalog.count() > 0) { await katalog.click(); await page.waitForTimeout(3000); }

// Wybierz kontrahenta
if (!(await page.evaluate(() => document.body.innerText)).includes("800738")) {
  const btns = await page.$$("button,[role='button']");
  for (const b of btns) {
    const t = (await b.textContent().catch(() => "")).toLowerCase();
    if (t.includes("kontrahent") || t.includes("wybierz")) { await b.click(); break; }
  }
  await page.waitForTimeout(2000);
  const item = await page.$("text=[800738]");
  if (item) { await item.click(); await page.waitForTimeout(3000); }
}

// Przełącz na widok siatki (kliknij ikonę grid)
await page.screenshot({ path: "before-grid.png" });
console.log("\nSzukam przycisku widoku siatki...");
const gridBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button, [role='button'], mat-button-toggle")]
    .map(b => ({
      class: b.className.slice(0, 80),
      aria: b.getAttribute("aria-label") || "",
      title: b.title || "",
      icon: b.querySelector("fa-icon, mat-icon")?.textContent?.trim() || "",
      text: b.innerText?.trim().slice(0, 30),
      rect: (() => { const r = b.getBoundingClientRect(); return {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width)}; })()
    }))
    .filter(b => b.rect.w > 0)
);
console.log("Przyciski na stronie:");
gridBtns.slice(0, 15).forEach(b =>
  console.log(`  class="${b.class.slice(0,40)}" aria="${b.aria}" icon="${b.icon}" text="${b.text}" x=${b.rect.x} y=${b.rect.y}`)
);

// Kliknij przycisk który wygląda jak grid/siatka
const gridBtn = gridBtns.find(b =>
  /grid|siatk|th-large|list|view/i.test(b.aria + b.icon + b.class + b.title)
);
if (gridBtn) {
  console.log(`\nKlikam przycisk siatki: aria="${gridBtn.aria}" icon="${gridBtn.icon}"`);
  await page.mouse.click(gridBtn.rect.x + 10, gridBtn.rect.y + 10);
  await page.waitForTimeout(3000);
}

// Sprawdź obrazki w DOM
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll("img")].map(i => ({ src: i.src, alt: i.alt })).filter(i => i.src && i.src.length > 10)
);
console.log("\nObrazki w DOM:", imgs.length);
imgs.slice(0, 5).forEach(i => console.log("  " + i.src.slice(0, 100)));

// Próba odczytu blob z images store
if (imgCount > 0) {
  const sample = await page.evaluate(() => new Promise(res => {
    const r = indexedDB.open("TsmDatabase");
    r.onsuccess = e => {
      const db = e.target.result;
      const store = db.transaction("images","readonly").objectStore("images");
      const req = store.openCursor();
      req.onsuccess = async ev => {
        const cursor = ev.target.result;
        if (!cursor) { db.close(); res(null); return; }
        const v = cursor.value;
        const safe = { key: cursor.key };
        for (const [k, val] of Object.entries(v)) {
          if (val instanceof Blob) {
            // Konwertuj do base64 żeby zobaczyć co to jest
            const ab = await val.arrayBuffer();
            const arr = new Uint8Array(ab);
            safe[k] = `Blob(${val.size}b, type=${val.type}, magic=${[...arr.slice(0,4)].map(x=>x.toString(16).padStart(2,'0')).join('')})`;
          } else if (val instanceof ArrayBuffer) {
            const arr = new Uint8Array(val);
            safe[k] = `ArrayBuffer(${val.byteLength}b, magic=${[...arr.slice(0,4)].map(x=>x.toString(16).padStart(2,'0')).join('')})`;
          } else {
            safe[k] = typeof val === "string" && val.length > 80 ? val.slice(0,80) : val;
          }
        }
        db.close();
        res(safe);
      };
    };
  }));
  console.log("\nPierwszy rekord w images:", JSON.stringify(sample, null, 2));
}

await page.screenshot({ path: "catalog-grid.png" });
console.log("\nScreenshot → catalog-grid.png");
console.log("\nRequesty do obrazków:", [...new Set(imageRequests)].slice(0,10).join("\n  "));

await browser.close();
