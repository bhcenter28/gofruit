"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Produkt } from "@/lib/supabase";
import { Package, ArrowRight } from "lucide-react";

interface Props {
  produkt: Produkt;
  onClick?: () => void;
}

export function ProductCard({ produkt, onClick }: Props) {
  return (
    <div>
      <button
        onClick={onClick}
        aria-label={`Zobacz szczegóły: ${produkt.nazwa}`}
        className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-[#CC1111]/40 hover:shadow-xl hover:shadow-[#CC1111]/10 transition-all duration-300 cursor-pointer overflow-hidden w-full text-left"
      >
        {/* Zdjęcie */}
        <div className="relative h-44 bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
          {produkt.zdjecie_url ? (
            <Image
              src={produkt.zdjecie_url}
              alt={produkt.nazwa}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
              style={{ mixBlendMode: "multiply" }}
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <Package className="w-10 h-10 text-[#CBD5E1]" aria-hidden="true" />
          )}
          {!produkt.dostepny && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                Niedostępny
              </span>
            </div>
          )}
        </div>

        {/* Treść */}
        <div className="p-4 flex-1 flex flex-col">
          {produkt.kategoria && (
            <Badge
              variant="secondary"
              className="self-start mb-2 text-xs bg-[#FFF1F1] text-[#CC1111] border-0 font-medium"
            >
              {produkt.kategoria.charAt(0) + produkt.kategoria.slice(1).toLowerCase()}
            </Badge>
          )}
          <h3
            className="font-semibold text-[#0F172A] text-sm leading-snug group-hover:text-[#CC1111] transition-colors duration-200 flex-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {produkt.nazwa}
          </h3>
          {produkt.jednostka && (
            <p className="text-xs text-[#94A3B8] mt-1.5">{produkt.jednostka}</p>
          )}
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
            {produkt.cena_netto && produkt.cena_netto > 0 ? (
              <span className="text-sm font-bold text-[#0F172A]">
                {Number(produkt.cena_netto).toFixed(2)} zł
                {produkt.jednostka && (
                  <span className="text-xs font-normal text-[#94A3B8]">
                    {" "}/ {produkt.jednostka.toLowerCase()}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-xs font-medium text-[#CC1111]">Zapytaj o ofertę</span>
            )}
            <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#CC1111] group-hover:translate-x-1 transition-all duration-200" aria-hidden="true" />
          </div>
        </div>
      </button>
    </div>
  );
}
