"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { parseCSV, mapRowToProdukt, type CsvRow } from "@/lib/csv-parser";
import { Upload, ArrowLeft, CheckCircle, Loader2, FileText } from "lucide-react";
import Link from "next/link";

const EXPECTED_FIELDS = ["nazwa", "indeks_erp", "kategoria", "opis", "jednostka"];

export default function ImportCSVPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"upload" | "map" | "preview" | "done">("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await parseCSV(file);
    if (data.length === 0) return;
    setHeaders(Object.keys(data[0]));
    setRows(data);
    const autoMap: Record<string, string> = {};
    EXPECTED_FIELDS.forEach((field) => {
      const match = Object.keys(data[0]).find(
        (h) => h.toLowerCase().replace(/[\s_-]/g, "") === field.replace(/[\s_-]/g, "")
      );
      if (match) autoMap[field] = match;
    });
    setMapping(autoMap);
    setStep("map");
  };

  const preview = rows
    .slice(0, 5)
    .map((row) => mapRowToProdukt(row, mapping))
    .filter(Boolean);

  const handleImport = async () => {
    setImporting(true);
    const mapped = rows.map((row) => mapRowToProdukt(row, mapping)).filter(Boolean);
    const res = await fetch("/api/produkty/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: mapped }),
    });
    const result = await res.json();
    setImportedCount(result.imported ?? 0);
    setImporting(false);
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/produkty"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#CC1111] transition-colors duration-200 cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Wróć do listy
        </Link>
        <h1
          className="text-2xl font-bold text-[#0F172A] mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Import produktów z CSV
        </h1>

        {/* Krok 1: Upload */}
        {step === "upload" && (
          <div
            className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center cursor-pointer hover:border-[#CC1111] transition-colors duration-200"
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Wybierz plik CSV"
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" aria-hidden="true" />
            <p className="font-semibold text-[#334155] mb-1">Kliknij, aby wybrać plik CSV</p>
            <p className="text-sm text-[#94A3B8]">
              Obsługiwane kolumny: nazwa, indeks_erp, kategoria, opis, jednostka
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        )}

        {/* Krok 2: Mapowanie kolumn */}
        {step === "map" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-5 h-5 text-[#CC1111]" aria-hidden="true" />
              <p className="font-semibold text-[#0F172A]">
                Wczytano {rows.length} wierszy. Dopasuj kolumny:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {EXPECTED_FIELDS.map((field) => (
                <div key={field} className="flex items-center gap-3">
                  <label className="w-28 text-sm font-medium text-[#334155] shrink-0">
                    {field}
                  </label>
                  <select
                    value={mapping[field] ?? ""}
                    onChange={(e) =>
                      setMapping((m) => ({ ...m, [field]: e.target.value }))
                    }
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1111] bg-white cursor-pointer"
                  >
                    <option value="">— pomiń —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep("preview")}
              disabled={!mapping.nazwa}
              className="px-5 py-2.5 rounded-lg bg-[#CC1111] text-white font-semibold hover:bg-[#AA0000] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
            >
              Podgląd danych
            </button>
          </div>
        )}

        {/* Krok 3: Podgląd */}
        {step === "preview" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="font-semibold text-[#0F172A] mb-4">
              Podgląd (pierwsze 5 z {rows.length} wierszy):
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="text-left px-3 py-2 text-[#64748B]">Nazwa</th>
                    <th className="text-left px-3 py-2 text-[#64748B]">Kategoria</th>
                    <th className="text-left px-3 py-2 text-[#64748B]">Jednostka</th>
                    <th className="text-left px-3 py-2 text-[#64748B]">Indeks ERP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.map((p, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium">{p!.nazwa}</td>
                      <td className="px-3 py-2 text-[#64748B]">{p!.kategoria ?? "—"}</td>
                      <td className="px-3 py-2 text-[#64748B]">{p!.jednostka ?? "—"}</td>
                      <td className="px-3 py-2 font-mono text-[#64748B]">{p!.indeks_erp ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleImport}
                disabled={importing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#CC1111] text-white font-semibold hover:bg-[#AA0000] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                {importing && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                {importing ? "Importowanie..." : `Importuj ${rows.length} produktów`}
              </button>
              <button
                onClick={() => setStep("map")}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-[#334155] hover:border-[#475569] transition-colors duration-200 cursor-pointer text-sm"
              >
                Wróć
              </button>
            </div>
          </div>
        )}

        {/* Krok 4: Sukces */}
        {step === "done" && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" aria-hidden="true" />
            <h2
              className="text-xl font-bold text-[#0F172A] mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Import zakończony!
            </h2>
            <p className="text-[#64748B] mb-6">
              Zaimportowano <strong>{importedCount}</strong> produktów.
            </p>
            <button
              onClick={() => router.push("/admin/produkty")}
              className="px-5 py-2.5 rounded-lg bg-[#0F172A] text-white font-semibold hover:bg-[#1E293B] transition-colors duration-200 cursor-pointer"
            >
              Przejdź do listy produktów
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
