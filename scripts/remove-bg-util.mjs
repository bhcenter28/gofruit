import { removeBackground } from "@imgly/background-removal-node";
import { PNG } from "pngjs";

function detectMime(buf) {
  if (buf[0] === 0xFF && buf[1] === 0xD8) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "image/png";
  if (buf[0] === 0x52 && buf[1] === 0x49) return "image/webp"; // RIFF
  if (buf[0] === 0x47 && buf[1] === 0x49) return "image/gif";
  return "image/jpeg"; // fallback
}

// Dekoduje PNG (w tym indexed + tRNS) i pakuje jako RGBA color type 6
function pngToRgba(buf) {
  return new Promise((resolve, reject) => {
    const png = new PNG();
    png.parse(buf, (err, data) => {
      if (err) return reject(err);
      const out = new PNG({ width: data.width, height: data.height, filterType: -1 });
      data.data.copy(out.data);
      const chunks = [];
      out.on("data", c => chunks.push(c));
      out.on("end", () => resolve(Buffer.concat(chunks)));
      out.on("error", reject);
      out.pack();
    });
  });
}

// input: Buffer (z Playwright lub fetch)
export async function removeBg(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(await fetch(input).then(r => r.arrayBuffer()));
  const mime = detectMime(buf);

  // Jeśli indexed PNG — najpierw konwertuj do RGBA, żeby biblioteka dostała poprawny input
  const inputBuf = mime === "image/png" ? await pngToRgba(buf) : buf;
  const inputMime = mime === "image/png" ? "image/png" : mime;

  const blob = new Blob([inputBuf], { type: inputMime });
  const result = await removeBackground(blob);
  const ab = await result.arrayBuffer();
  const bgRemoved = Buffer.from(ab);

  // Upewnij się że output jest RGBA (color type 6) — biblioteka może produkować indexed
  const outMime = detectMime(bgRemoved);
  if (outMime === "image/png" && bgRemoved[25] !== 6) {
    return pngToRgba(bgRemoved);
  }
  return bgRemoved;
}
