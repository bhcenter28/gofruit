"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import type { Produkt } from "@/lib/supabase";
import { PackageSearch, MessageCircle, ArrowRight, RotateCcw, Search, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  produkty: Produkt[];
  szukaj?: string;
  kategoria?: string;
}

const POPULAR_CATEGORIES = [
  { label: "Napoje",    kat: "NAPOJE" },
  { label: "Słodycze",  kat: "SŁODYCZE" },
  { label: "Nabiał",    kat: "NABIAŁ" },
  { label: "Wędliny",   kat: "WĘDLINY" },
  { label: "Piekarnia", kat: "PIEKARNIA" },
  { label: "Spożywcze", kat: "SPOŻYWCZE" },
];

const TIPS = [
  { icon: Search, text: "Sprawdź pisownię — np. \"jogurt\" zamiast \"joggurt\"" },
  { icon: Tag,    text: "Szukaj po marce — np. \"Danone\", \"Mlekovita\"" },
  { icon: RotateCcw, text: "Użyj ogólniejszej frazy — np. \"mleko\" zamiast \"mleko UHT 3,2%\"" },
  { icon: Search, text: "Spróbuj wyszukać po kodzie kreskowym EAN — np. \"5901234567890\"" },
];

function EmptyStateSearch({ szukaj }: { szukaj: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto"
    >
      {/* Ikona z glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-3xl bg-[#CC1111] blur-2xl opacity-20 scale-110" />
        <div className="relative w-20 h-20 rounded-3xl bg-[#0F172A] flex items-center justify-center border border-[#1E293B]">
          <PackageSearch className="w-9 h-9 text-[#CC1111]" />
        </div>
      </div>

      {/* Nagłówek */}
      <h3
        className="text-xl font-black text-[#0F172A] mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Nie znaleziono produktów
      </h3>
      <p className="text-sm text-[#64748B] mb-7">
        Brak wyników dla{" "}
        <span className="font-bold text-[#0F172A] px-1.5 py-0.5 bg-[#F1F5F9] rounded-md">
          &bdquo;{szukaj}&rdquo;
        </span>
      </p>

      {/* Tipy */}
      <div className="w-full flex flex-col gap-2.5 mb-7">
        {TIPS.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-gray-100 text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#CC1111]" />
            </div>
            <span className="text-xs text-[#475569]">{text}</span>
          </motion.div>
        ))}
      </div>

      {/* Popularne kategorie */}
      <div className="w-full mb-7">
        <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
          Przeglądaj kategorie
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {POPULAR_CATEGORIES.map(({ label, kat }) => (
            <Link
              key={kat}
              href={`/katalog?kategoria=${encodeURIComponent(kat)}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-[#334155] hover:border-[#CC1111]/40 hover:text-[#CC1111] hover:bg-[#FFF1F1] transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2.5 w-full">
        <Link
          href={`/kontakt?produkt=${encodeURIComponent(szukaj)}`}
          className="group flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#CC1111] text-white text-sm font-bold hover:bg-[#AA0000] transition-all duration-200 shadow-lg shadow-[#CC1111]/25 hover:-translate-y-0.5"
        >
          <MessageCircle className="w-4 h-4" />
          Zapytaj o dostępność
          <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/katalog"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#334155] hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Wyczyść wyszukiwanie
        </Link>
      </div>
    </motion.div>
  );
}

function EmptyStateCategory({ kategoria }: { kategoria?: string }) {
  const label = kategoria
    ? kategoria.charAt(0) + kategoria.slice(1).toLowerCase()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-16 text-center max-w-xs mx-auto"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-gray-200 flex items-center justify-center mb-4">
        <PackageSearch className="w-8 h-8 text-[#CBD5E1]" />
      </div>
      <h3
        className="text-base font-bold text-[#334155] mb-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {label ? `Brak produktów w kategorii ${label}` : "Brak produktów"}
      </h3>
      <p className="text-sm text-[#94A3B8] mb-5">
        Spróbuj wybrać inną kategorię.
      </p>
      <Link
        href="/katalog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#CC1111] hover:gap-2.5 transition-all"
      >
        Zobacz wszystkie produkty
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

export function ProductGrid({ produkty, szukaj, kategoria }: Props) {
  const [selected, setSelected] = useState<Produkt | null>(null);

  if (produkty.length === 0) {
    return szukaj
      ? <EmptyStateSearch szukaj={szukaj} />
      : <EmptyStateCategory kategoria={kategoria} />;
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      >
        {produkty.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } },
            }}
          >
            <ProductCard produkt={p} onClick={() => setSelected(p)} />
          </motion.div>
        ))}
      </motion.div>

      <ProductModal produkt={selected} onClose={() => setSelected(null)} />
    </>
  );
}
