"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Phone, Mail, Package, ArrowRight } from "lucide-react";
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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = produkt ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [produkt]);

  const reduced = useReducedMotion();
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none"
          >
            <div
              className="relative w-full sm:max-w-2xl lg:max-w-3xl rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl pointer-events-auto"
              style={{ maxHeight: "94vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Zamknij */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-gray-300 hover:shadow-md transition-all cursor-pointer shadow-sm"
                aria-label="Zamknij"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.15fr]">

                {/* ===== LEWA — ciemna z glow ===== */}
                <div
                  className="relative flex flex-col items-center justify-center min-h-56 sm:min-h-[480px] overflow-hidden"
                  style={{ background: "#0F172A" }}
                >
                  {/* Subtelna siatka */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Glow blob — pulsuje */}
                  <motion.div
                    className="absolute rounded-full blur-3xl pointer-events-none"
                    style={{
                      width: 280,
                      height: 280,
                      backgroundColor: color,
                    }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={reduced ? { opacity: 0.22, scale: 1 } : { opacity: [0.18, 0.28, 0.18], scale: [1, 1.12, 1] }}
                    transition={{ duration: 3.5, repeat: reduced ? 0 : Infinity, ease: "easeInOut", delay: 0.2 }}
                  />

                  {/* Drugi mniejszy glow na dole */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full blur-2xl pointer-events-none"
                    style={{ width: 160, height: 80, backgroundColor: color }}
                    animate={reduced ? { opacity: 0.25 } : { opacity: [0.2, 0.35, 0.2] }}
                    transition={{ duration: 2.5, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
                  />

                  {/* Produkt */}
                  {produkt.zdjecie_url ? (
                    <motion.div
                      initial={{ y: 50, rotate: 10, opacity: 0, scale: 0.75 }}
                      animate={{ y: reduced ? 0 : [0, -8, 0], rotate: -3, opacity: 1, scale: 1 }}
                      transition={{
                        opacity: { duration: 0.5, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] },
                        scale:   { duration: 0.5, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] },
                        rotate:  { duration: 0.5, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] },
                        y: { duration: 4, repeat: reduced ? 0 : Infinity, ease: "easeInOut", delay: 0.6 },
                      }}
                      className="relative z-10 flex items-center justify-center"
                      style={{ width: 240, height: 240 }}
                    >
                      {/* Biała karta — mix-blend-mode:multiply sprawia że białe tło produktu znika */}
                      <div
                        className="relative w-56 h-56 rounded-2xl bg-white flex items-center justify-center overflow-hidden"
                        style={{ boxShadow: `0 8px 40px ${color}50` }}
                      >
                        <Image
                          src={produkt.zdjecie_url}
                          alt={produkt.nazwa}
                          fill
                          className="object-contain"
                          style={{ mixBlendMode: "multiply" }}
                          sizes="280px"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="relative z-10 w-28 h-28 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
                    >
                      <Package className="w-12 h-12" style={{ color }} />
                    </motion.div>
                  )}

                  {/* Watermark kategoria */}
                  {katLabel && (
                    <div
                      className="absolute bottom-4 left-0 right-0 text-center text-[56px] font-black uppercase leading-none select-none pointer-events-none"
                      style={{
                        color: `${color}15`,
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {katLabel}
                    </div>
                  )}

                  {/* Niedostępny */}
                  {!produkt.dostepny && (
                    <div className="absolute inset-0 z-20 bg-[#0F172A]/80 flex items-center justify-center">
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Niedostępny</span>
                    </div>
                  )}
                </div>

                {/* ===== PRAWA — informacje ===== */}
                <div className="bg-white flex flex-col overflow-y-auto" style={{ maxHeight: "94vh" }}>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">

                    {/* Kategoria badge */}
                    {katLabel && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18 }}
                        className="inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {katLabel}
                      </motion.span>
                    )}

                    {/* Nazwa */}
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 }}
                      className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {produkt.nazwa}
                    </motion.h2>

                    {/* Marka */}
                    {produkt.marka && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.26 }}
                        className="text-sm font-semibold mb-4"
                        style={{ color }}
                      >
                        {produkt.marka}
                      </motion.p>
                    )}

                    {/* Opis */}
                    {produkt.opis && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.28 }}
                        className="text-sm text-[#64748B] leading-relaxed mb-5"
                      >
                        {produkt.opis}
                      </motion.p>
                    )}

                    {/* Cena */}
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-2xl p-4 mb-5"
                      style={{ background: `${color}0d`, border: `1.5px solid ${color}25` }}
                    >
                      {produkt.cena_netto && produkt.cena_netto > 0 ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-[#0F172A]">
                            {Number(produkt.cena_netto).toFixed(2)} zł
                          </span>
                          {produkt.jednostka && (
                            <span className="text-sm text-[#94A3B8]">/ {produkt.jednostka}</span>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">Cena dostępna po kontakcie</p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">Zapytaj o aktualne warunki handlowe</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Detale */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="flex-1 mb-6"
                    >
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Jednostka",  value: produkt.jednostka },
                          { label: "Karton",     value: produkt.karton ? `${produkt.karton} szt.` : null },
                          { label: "Waga netto", value: produkt.waga_netto },
                          { label: "Waga brutto",value: produkt.waga_brutto },
                          { label: "Znacznik",   value: produkt.znacznik },
                          { label: "Podgrupa",   value: produkt.podpodgrupa },
                          { label: "Kod EAN",    value: produkt.kod_kreskowy },
                          { label: "PKWiU",      value: produkt.kod_pkwiu },
                          { label: "Koncesja",   value: produkt.rodzaj_koncesji },
                        ].filter(r => r.value).map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex flex-col px-3 py-2 rounded-xl bg-[#F8FAFC] border border-gray-100"
                          >
                            <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-0.5">
                              {label}
                            </span>
                            <span className="text-xs font-bold text-[#0F172A] break-all">{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Skład osobno bo długi */}
                      {produkt.sklad && (
                        <div className="mt-3 px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-100">
                          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1">
                            Skład
                          </span>
                          <span className="text-xs text-[#475569] leading-relaxed">{produkt.sklad}</span>
                        </div>
                      )}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.42 }}
                      className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100"
                    >
                      <Link
                        href={`/kontakt?produkt=${encodeURIComponent(produkt.nazwa)}`}
                        onClick={onClose}
                        className="group flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 8px 24px ${color}40`,
                        }}
                      >
                        <Mail className="w-4 h-4" />
                        Zapytaj o produkt
                        <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <a
                        href="tel:+48000000000"
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-[#334155] hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Phone className="w-4 h-4" />
                        Zadzwoń
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
