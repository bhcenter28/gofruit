"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface Props {
  kategorie: string[];
  currentKategoria: string;
  currentSzukaj: string;
}

export function KatalogFilters({ kategorie, currentKategoria, currentSzukaj }: Props) {
  const router = useRouter();
  const [szukaj, setSzukaj] = useState(currentSzukaj);

  useEffect(() => {
    setSzukaj(currentSzukaj);
  }, [currentSzukaj]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (szukaj.trim()) {
        params.set("szukaj", szukaj.trim());
        // search across all — no category
      } else if (currentKategoria) {
        params.set("kategoria", currentKategoria);
      }
      router.replace(`/katalog${params.toString() ? `?${params.toString()}` : ""}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [szukaj]); // eslint-disable-line react-hooks/exhaustive-deps

  function goToKategoria(kat: string) {
    setSzukaj("");
    const params = new URLSearchParams();
    if (kat) params.set("kategoria", kat);
    router.push(`/katalog${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
      {/* Wyszukiwarka */}
      <div className="mb-5">
        <label
          htmlFor="szukaj"
          className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2"
        >
          Szukaj
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
            aria-hidden="true"
          />
          <input
            id="szukaj"
            type="text"
            value={szukaj}
            onChange={(e) => setSzukaj(e.target.value)}
            placeholder="Nazwa produktu..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1111] focus:border-transparent"
          />
          {szukaj && (
            <button
              onClick={() => setSzukaj("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {szukaj && (
          <p className="text-xs text-[#CC1111] mt-1">Szukasz we wszystkich kategoriach</p>
        )}
      </div>

      {/* Kategorie */}
      <div>
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
          Kategoria
        </p>
        <ul className="space-y-0.5">
          {kategorie.map((kat) => (
            <li key={kat}>
              <button
                onClick={() => goToKategoria(kat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                  !szukaj && currentKategoria === kat
                    ? "bg-[#0F172A] text-white font-medium"
                    : "text-[#334155] hover:bg-[#F1F5F9]"
                }`}
              >
                {kat === "" ? "Wszystkie" : kat.charAt(0) + kat.slice(1).toLowerCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
