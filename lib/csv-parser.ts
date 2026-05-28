import Papa from "papaparse";

export type CsvRow = Record<string, string>;

export function parseCSV(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}

export function mapRowToProdukt(row: CsvRow, mapping: Record<string, string>) {
  const get = (field: string) => (mapping[field] ? row[mapping[field]]?.trim() ?? "" : "");

  const nazwa = get("nazwa");
  if (!nazwa) return null;

  const slug = nazwa
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    nazwa,
    slug: `${slug}-${get("indeks_erp") || Math.random().toString(36).slice(2, 7)}`,
    kategoria: get("kategoria") || undefined,
    opis: get("opis") || undefined,
    jednostka: get("jednostka") || undefined,
    indeks_erp: get("indeks_erp") || undefined,
    dostepny: true,
  };
}
