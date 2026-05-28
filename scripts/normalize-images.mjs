/**
 * Normalizuje zdjęcia produktów w Supabase Storage:
 * - przycina białe marginesy
 * - centruje produkt na kwadratowym białym tle z 12% paddingiem
 * - wgrywa z powrotem jako PNG
 *
 * Uruchom: cd fruit && node scripts/normalize-images.mjs
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { normalizeImage } from "./normalize-util.mjs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

const CONCURRENCY = 4;
const BATCH_SIZE = 1000;

console.log("Ładuję produkty ze zdjęciami...");
const toProcess = [];
let from = 0;
while (true) {
  const { data, error } = await supabase
    .from("produkty")
    .select("id, zdjecie_url")
    .not("zdjecie_url", "is", null)
    .range(from, from + BATCH_SIZE - 1);
  if (error || !data || data.length === 0) break;
  toProcess.push(...data);
  if (data.length < BATCH_SIZE) break;
  from += BATCH_SIZE;
}
console.log(`Do normalizacji: ${toProcess.length} zdjęć\n`);

let done = 0, errors = 0, skipped = 0;
const errorCounts = {};

async function processOne({ id, zdjecie_url }) {
  try {
    const res = await fetch(zdjecie_url);
    if (!res.ok) return `fetch-fail:${res.status}`;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return `too-small`;

    const normalized = await normalizeImage(buf);

    // Jeśli normalizeImage zwróciło oryginał (cały biały) — pomiń
    if (normalized === buf) { skipped++; return "ok-skip"; }

    const rowId = zdjecie_url.split("/").pop().replace(/\.\w+$/, "");
    const file = `${rowId}.png`;

    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(file, normalized, { contentType: "image/png", upsert: true });
    if (uploadErr) return `upload-error:${uploadErr.message.slice(0, 60)}`;

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(file);

    const { error: updateErr } = await supabase
      .from("produkty")
      .update({ zdjecie_url: publicUrl })
      .eq("id", id);
    if (updateErr) return `update-error:${updateErr.message.slice(0, 60)}`;

    return "ok";
  } catch (e) {
    return `error:${e.message.slice(0, 80)}`;
  }
}

for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
  const batch = toProcess.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map(p => processOne(p)));

  for (const r of results) {
    if (r === "ok") done++;
    else if (r === "ok-skip") skipped++;
    else {
      errors++;
      const key = r.replace(/:\d+$/, "").slice(0, 50);
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    }
  }

  const pct = Math.round(((i + batch.length) / toProcess.length) * 100);
  process.stdout.write(`\r  [${i + batch.length}/${toProcess.length}] ${pct}% — ok:${done} pominięto:${skipped} błędy:${errors}   `);
}

console.log(`\n
==============================================
✅ NORMALIZACJA GOTOWA
   Znormalizowano: ${done}
   Pominięto:      ${skipped} (cały biały / bez produktu)
   Błędy:          ${errors}
==============================================`);

if (errors > 0) {
  console.log("\n📊 Typy błędów:");
  for (const [k, v] of Object.entries(errorCounts).sort((a,b) => b[1]-a[1]))
    console.log(`  ${v}x  ${k}`);
}
