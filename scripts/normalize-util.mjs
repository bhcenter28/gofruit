import { Jimp } from "jimp";

const WHITE_THRESHOLD = 240; // piksel "biały" jeśli R,G,B >= 240

// Zwraca bounding box niepustych pikseli lub null jeśli cały obraz biały
function getBoundingBox(img) {
  const { width, height } = img.bitmap;
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = img.bitmap.data[idx];
      const g = img.bitmap.data[idx + 1];
      const b = img.bitmap.data[idx + 2];
      const a = img.bitmap.data[idx + 3];
      // Traktuj jako "produkt" jeśli piksel jest widoczny i nie jest biały
      if (a > 20 && (r < WHITE_THRESHOLD || g < WHITE_THRESHOLD || b < WHITE_THRESHOLD)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX > maxX || minY > maxY) return null;
  return { minX, minY, maxX, maxY };
}

// input: Buffer (JPEG, PNG, WebP)
// output: PNG Buffer z produktem wycentrowanym i 10% marginesem
export async function normalizeImage(input) {
  const img = await Jimp.read(input);
  const bb = getBoundingBox(img);

  if (!bb) return input; // cały biały lub pusty — zwróć oryginał

  const { minX, minY, maxX, maxY } = bb;
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Padding 12% z każdej strony
  const padPct = 0.12;
  const outSize = Math.round(Math.max(cropW, cropH) * (1 + padPct * 2));
  const padPx = Math.round(outSize * padPct);

  // Przytnij do bounding box
  img.crop({ x: minX, y: minY, w: cropW, h: cropH });

  // Stwórz kwadratowe białe płótno i wklej produkt na środku
  const canvas = new Jimp({ width: outSize, height: outSize, color: 0xffffffff });
  const offsetX = Math.round((outSize - cropW) / 2);
  const offsetY = Math.round((outSize - cropH) / 2);
  canvas.composite(img, offsetX, offsetY);

  return canvas.getBuffer("image/png");
}
