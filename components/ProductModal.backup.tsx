"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Package } from "lucide-react";
import type { Produkt } from "@/lib/supabase";

const categoryColors: Record<string, string> = {
  NAPOJE:    "#3B82F6",
  SŁODYCZE:  "#EC4899",
  NABIAŁ:    "#8B5CF6",
  WĘDLINY:   "#EF4444",
  CHEMIA:    "#10B981",
  PIEKARNIA: "#F59E0B",
  SPOŻYWCZE: "#F97316",
  HERBATA:   "#84CC16",
  KAWA:      "#92400E",
  KONSERWY:  "#6B7280",
  RYBY:      "#0EA5E9",
  PRZYPRAWY: "#DC2626",
};

function getCategoryColor(kat: string | null | undefined) {
  if (!kat) return "#CC1111";
  return categoryColors[kat.toUpperCase()] ?? "#CC1111";
}

interface Props {
  produkt: Produkt | null;
  onClose: () => void;
}

export function ProductModal({ produkt, onClose }: Props) {
  // Zamknij na Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Blokuj scroll body
  useEffect(() => {
    if (produkt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [produkt]);

  const color = getCategoryColor(produkt?.kategoria);
  const katLabel = produkt?.kategoria
    ? produkt.kategoria.charAt(0) + produkt.kategoria.slice(1).toLowerCase()
    : null;

  return (
    <AnimatePresence>
      {produkt && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <div
              className="relative w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
              style={{ maxHeight: "92vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Kolorowy accent top bar */}
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

              {/* Scroll container */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 6px)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2">

                  {/* Lewa — zdjęcie */}
                  <div
                    className="relative flex items-center justify-center min-h-64 sm:min-h-80 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}
                  >
                    {/* Glow blob za zdjęciem */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.4, opacity: 0.25 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="absolute w-48 h-48 rounded-full blur-3xl"
                      style={{ backgroundColor: color }}
                    />

                    {/* Produkt "wpada" z dołu jak w oryginale */}
                    {produkt.zdjecie_url ? (
                      <motion.div
                        initial={{ y: 60, rotate: 8, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, rotate: -3, opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="relative w-52 h-52 sm:w-64 sm:h-64"
                      >
                        <Image
                          src={produkt.zdjecie_url}
                          alt={produkt.nazwa}
                          fill
                          className="object-contain drop-shadow-xl"
                          sizes="300px"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <Package className="w-24 h-24 text-gray-200" />
                      </motion.div>
                    )}

                    {/* Niedostępny badge */}
                    {!produkt.dostepny && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Niedostępny</span>
                      </div>
                    )}
                  </div>

                  {/* Prawa — info */}
                  <div className="p-6 sm:p-8 flex flex-col">
                    {/* Kategoria */}
                    {katLabel && (
                      <motion.span
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-bold mb-3"
                        style={{ backgroundColor: `${color}18`, color }}
                      >
                        {katLabel}
                      </motion.span>
                    )}

                    {/* Nazwa */}
                    <motion.h2
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-tight mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {produkt.nazwa}
                    </motion.h2>

                    {/* Opis */}
                    {produkt.opis && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-[#64748B] leading-relaxed mb-4"
                      >
                        {produkt.opis}
                      </motion.p>
                    )}

                    {/* Cena */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32 }}
                      className="rounded-xl p-4 mb-5"
                      style={{ backgroundColor: `${color}10`, border: `1px solid ${color}25` }}
                    >
                      {produkt.cena_netto && produkt.cena_netto > 0 ? (
                        <>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color }}>
                            Cena netto
                          </p>
                          <p className="text-3xl font-bold text-[#0F172A]">
                            {Number(produkt.cena_netto).toFixed(2)} zł
                            {produkt.jednostka && (
                              <span className="text-sm font-normal text-[#94A3B8] ml-1">
                                / {produkt.jednostka}
                              </span>
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-[#0F172A]">Cena dostępna po kontakcie</p>
                          <p className="text-xs text-[#64748B] mt-0.5">Skontaktuj się z nami po warunki</p>
                        </>
                      )}
                    </motion.div>

                    {/* Detale — wszystkie pola */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.38 }}
                      className="mb-5"
                    >
                      <dl className="divide-y divide-gray-50 text-xs">
                        {[
                          { label: "Marka",            value: produkt.marka },
                          { label: "Jednostka miary",  value: produkt.jednostka },
                          { label: "Karton",           value: produkt.karton ? `${produkt.karton} szt.` : null },
                          { label: "Waga netto",       value: produkt.waga_netto },
                          { label: "Waga brutto",      value: produkt.waga_brutto },
                          { label: "Podpodgrupa",      value: produkt.podpodgrupa },
                          { label: "Znacznik",         value: produkt.znacznik },
                          { label: "Skład",            value: produkt.sklad },
                          { label: "Kod kreskowy",     value: produkt.kod_kreskowy },
                          { label: "Kod PKWiU",        value: produkt.kod_pkwiu },
                          { label: "Rodzaj koncesji",  value: produkt.rodzaj_koncesji },
                        ].filter(r => r.value).map(({ label, value }) => (
                          <div key={label} className="flex py-1.5">
                            <dt className="w-36 shrink-0 text-[#94A3B8]">{label}</dt>
                            <dd className="font-semibold text-[#0F172A] break-all">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.42 }}
                      className="flex flex-col gap-2 mt-auto"
                    >
                      <Link
                        href={`/kontakt?produkt=${encodeURIComponent(produkt.nazwa)}`}
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-colors duration-200"
                        style={{ backgroundColor: color }}
                      >
                        <Mail className="w-4 h-4" />
                        Zapytaj o produkt
                      </Link>
                      <a
                        href="tel:+48000000000"
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-[#334155] hover:border-gray-300 transition-colors duration-200"
                      >
                        <Phone className="w-4 h-4" />
                        Zadzwoń
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* X — zamknij */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-gray-300 transition-colors shadow-sm cursor-pointer z-10"
                aria-label="Zamknij"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
