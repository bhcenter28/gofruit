/**
 * Pobiera już wgrane zdjęcia z Supabase Storage, usuwa tło, wgrywa z powrotem jako PNG.
 * Uruchom: cd fruit && node scripts/reprocess-bg.mjs
 *
 * Można uruchamiać wielokrotnie — pomija produkty których URL już kończy się na .png
 * (zakładamy że PNG = już przeprocesowane).
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { removeBg } from "./remove-bg-util.mjs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

const CONCURRENCY = 6;
const BATCH_SIZE  = 1000;
const FORCE = process.argv.includes("--force");
const limitArg = process.argv.find(a => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1]) : Infinity;

console.log(`Ładuję produkty do przeprocesowania... ${FORCE ? "(tryb --force: wszystkie PNG)" : ""}${LIMIT < Infinity ? ` [limit: ${LIMIT}]` : ""}`);
const toProcess = [];
let from = 0;
while (true) {
  let query = supabase
    .from("produkty")
    .select("id, zdjecie_url")
    .not("zdjecie_url", "is", null);
  if (!FORCE) query = query.not("zdjecie_url", "like", "%.png%");
  const { data, error } = await query.range(from, from + BATCH_SIZE - 1);
  if (error || !data || data.length === 0) break;
  toProcess.push(...data);
  if (toProcess.length >= LIMIT || data.length < BATCH_SIZE) break;
  from += BATCH_SIZE;
}
if (toProcess.length > LIMIT) toProcess.length = LIMIT;

console.log(`Do przeprocesowania: ${toProcess.length} zdjęć`);
if (toProcess.length === 0) {
  console.log("Wszystkie zdjęcia już są PNG — nic do roboty!");
  process.exit(0);
}

let done = 0, errors = 0;
const errorCounts = {};

async function processOne({ id, zdjecie_url }) {
  try {
    // Usuń tło — przekazujemy URL bezpośrednio
    const pngBuffer = await removeBg(zdjecie_url);

    // Wyciągnij rowId z URL (ostatni segment bez rozszerzenia)
    const rowId = zdjecie_url.split("/").pop().replace(/\.\w+$/, "");
    const file = `${rowId}.png`;

    // Upload z nadpisaniem
    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(file, pngBuffer, { contentType: "image/png", upsert: true });
    if (uploadErr) return `upload-error:${uploadErr.message}`;

    // Nowy publiczny URL
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(file);

    // Zaktualizuj w DB
    const { error: updateErr } = await supabase
      .from("produkty")
      .update({ zdjecie_url: publicUrl })
      .eq("id", id);
    if (updateErr) return `update-error:${updateErr.message}`;

    return "ok";
  } catch (e) {
    return `error:${e.message.slice(0, 80)}`;
  }
}

console.log(`\nPrzetwarzam po ${CONCURRENCY} równocześnie...\n`);

for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
  const batch = toProcess.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map(p => processOne(p)));

  for (const r of results) {
    if (r === "ok") done++;
    else {
      errors++;
      const key = r.replace(/:\d+$/, "").slice(0, 50);
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    }
  }

  const pct = Math.round(((i + batch.length) / toProcess.length) * 100);
  process.stdout.write(`\r  [${i + batch.length}/${toProcess.length}] ${pct}% — ok:${done} błędy:${errors}   `);
}

console.log(`\n
==============================================
✅ REPROCESSING GOTOWY
   Przeprocesowano: ${done}
   Błędy:           ${errors}
==============================================`);

if (errors > 0) {
  console.log("\n📊 Typy błędów:");
  for (const [k, v] of Object.entries(errorCounts).sort((a,b) => b[1]-a[1])) {
    console.log(`  ${v}x  ${k}`);
  }
}
