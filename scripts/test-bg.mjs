/**
 * Szybki test usuwania tła na 5 losowych produktach
 * Uruchom: cd fruit && node scripts/test-bg.mjs
 * Zapisuje wyniki do scripts/test-output/
 */
import { readFileSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { removeBg } from "./remove-bg-util.mjs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);
const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

mkdirSync(new URL("./test-output/", import.meta.url), { recursive: true });

const { data } = await supabase
  .from("produkty")
  .select("id, nazwa, zdjecie_url")
  .not("zdjecie_url", "is", null)
  .limit(5);

for (const p of data) {
  console.log(`Przetwarzam: ${p.nazwa}`);
  const res = await fetch(p.zdjecie_url);
  const ab = await res.arrayBuffer();
  const png = await removeBg(Buffer.from(ab));
  const outPath = new URL(`./test-output/${p.id}.png`, import.meta.url);
  await writeFile(outPath, png);
  console.log(`  → zapisano: scripts/test-output/${p.id}.png (${(png.length/1024).toFixed(0)} KB)`);
}

console.log("\nOtwórz pliki PNG w przeglądarce/podglądzie i sprawdź jakość tła.");
