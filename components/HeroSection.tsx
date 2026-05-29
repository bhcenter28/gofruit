"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight, ShieldCheck,
  Store, UtensilsCrossed, Fuel,
  Droplets, Candy, Milk, Ham, FlaskConical, Wheat,
} from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const categories: { name: string; kat: string; Icon: LucideIcon; color: string; num: number }[] = [
  { name: "Napoje",    kat: "NAPOJE",    Icon: Droplets,     color: "#3B82F6", num: 1011 },
  { name: "Słodycze",  kat: "SŁODYCZE",  Icon: Candy,        color: "#EC4899", num: 1122 },
  { name: "Nabiał",    kat: "NABIAŁ",    Icon: Milk,         color: "#8B5CF6", num: 1240 },
  { name: "Wędliny",   kat: "WĘDLINY",   Icon: Ham,          color: "#EF4444", num: 1445 },
  { name: "Chemia",    kat: "CHEMIA",    Icon: FlaskConical, color: "#10B981", num: 1722 },
  { name: "Piekarnia", kat: "PIEKARNIA", Icon: Wheat,        color: "#F59E0B", num: 477  },
];

const clients = [
  { Icon: Store,           label: "Sklepy spożywcze" },
  { Icon: UtensilsCrossed, label: "Restauracje i bary" },
  { Icon: Fuel,            label: "Stacje benzynowe" },
];

const words = ["Produkty", "spożywcze", "dla", "Twojego", "biznesu"];

const TOTAL = 7017;

function CountUp({ to, suffix = "", delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const duration = 1100;
      const steps = 55;
      const increment = to / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= to) { setCount(to); clearInterval(timer); }
        else { setCount(Math.floor(current)); }
      }, duration / steps);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, to, delay]);

  return <span ref={ref}>{count.toLocaleString("pl-PL")}{suffix}</span>;
}

function ShowcasePanel({ reduced }: { reduced: boolean | null }) {
  const innerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = innerRef.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    el.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 6}deg)`;
  }

  function handleMouseLeave() {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(2deg) rotateY(-8deg)";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full"
    >
      {/* Glow za panelem */}
      <div
        className="absolute -inset-6 rounded-3xl blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 60% 40%, #CC1111 0%, #3B82F660 50%, transparent 75%)" }}
        aria-hidden="true"
      />

      <div
        ref={innerRef}
        style={{ transform: "perspective(1000px) rotateX(2deg) rotateY(-8deg)", transition: "transform 0.4s ease" }}
        className="relative rounded-2xl overflow-hidden border border-[#1E293B] shadow-2xl shadow-black/60"
        aria-label="Podgląd katalogu produktów"
      >
        {/* ── Title bar ── */}
        <div className="bg-[#0A111E] px-5 py-3.5 flex items-center gap-3 border-b border-[#1E293B]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]/70" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]/70" />
            <div className="w-3 h-3 rounded-full bg-[#22C55E]/70" />
          </div>
          <span className="flex-1 text-center text-[11px] font-medium text-[#475569] tracking-wide">
            katalog.gofruit.pl
          </span>
        </div>

        {/* ── Search bar ── */}
        <div className="bg-[#0D1424] px-5 py-3 border-b border-[#1E293B]">
          <Link
            href="/katalog"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#CC1111]/40 hover:bg-[#0F172A]/80 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#334155] group-hover:text-[#CC1111] shrink-0 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <span className="text-sm text-[#334155] group-hover:text-[#64748B] transition-colors duration-200">Szukaj produktów…</span>
            <span className="ml-auto text-[10px] text-[#1E293B] font-mono border border-[#1E293B] rounded px-1.5 py-0.5">⌘K</span>
          </Link>
        </div>

        {/* ── Stats row ── */}
        <div className="bg-[#0D1424] px-5 py-3 grid grid-cols-2 gap-3 border-b border-[#1E293B]">
          {[
            { to: 48,  suffix: "h", label: "czas dostawy",      delay: 700  },
            { to: 10,  suffix: "+", label: "lat doświadczenia",  delay: 800  },
          ].map(({ to, suffix, label, delay }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="text-center"
            >
              <p className="text-base font-black text-white leading-tight">
                <CountUp to={to} suffix={suffix} delay={delay} />
              </p>
              <p className="text-[10px] text-[#475569] mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Category list ── */}
        <div className="bg-[#0D1424] px-5 py-3 space-y-1.5">
          {categories.map(({ name, kat, Icon, color, num }, i) => {
            const pct = Math.round((num / TOTAL) * 100);
            const countDelay = 900 + i * 80;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.06, duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <Link
                  href={`/katalog?kategoria=${encodeURIComponent(kat)}`}
                  className="group flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors duration-150">{name}</span>
                      <span className="text-[11px] font-bold opacity-70 group-hover:opacity-100 transition-opacity duration-150" style={{ color }}>
                        <CountUp to={num} suffix=" prod." delay={countDelay} />
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: 0.85 + i * 0.07, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                  <svg className="w-3 h-3 text-[#334155] opacity-0 group-hover:opacity-40 group-hover:text-white transition-all duration-150 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Footer CTA ── */}
        <div className="bg-[#0A111E] px-5 py-3.5 border-t border-[#1E293B] flex items-center justify-between">
          <span className="text-[11px] text-[#334155]">6 z 30+ kategorii w ofercie</span>
          <Link
            href="/katalog"
            className="group text-[11px] font-bold text-[#CC1111] hover:text-[#FF4444] flex items-center gap-1 transition-colors duration-150"
          >
            Przeglądaj wszystkie
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-[#0F172A] text-white overflow-hidden min-h-screen flex items-center">

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Red glow — top right */}
        <motion.div
          className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, #CC1111 0%, transparent 65%)" }}
          animate={reduced ? {} : { opacity: [0.07, 0.13, 0.07] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Blue glow — bottom left */}
        <motion.div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)" }}
          animate={reduced ? {} : { opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-16 items-center">

          {/* ===== LEFT COLUMN ===== */}
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#CC1111]/12 border border-[#CC1111]/25 text-[#FCA5A5] text-sm font-semibold mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CC1111] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CC1111]" />
              </span>
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              Zaufana hurtownia od lat
            </motion.div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] mb-6 overflow-hidden"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.09 } } }}
                className="flex flex-wrap gap-x-4 gap-y-1"
              >
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 44, filter: "blur(8px)" },
                      show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
                    }}
                    className={i >= 3 ? "text-[#FC8181]" : ""}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="text-base sm:text-lg text-[#94A3B8] mb-10 leading-relaxed max-w-xl"
            >
              Hurtownia produktów spożywczych dla sklepów, restauracji i stacji benzynowych.
              Ponad <span className="text-white font-semibold">13 000 produktów</span>, konkurencyjne ceny i szybka dostawa.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/katalog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#CC1111] text-white font-bold text-sm hover:bg-[#AA0000] transition-colors duration-200 shadow-lg shadow-[#CC1111]/35 w-full sm:w-auto"
                >
                  Zobacz katalog
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#334155] text-[#CBD5E1] font-semibold text-sm hover:border-[#475569] hover:text-white transition-all duration-200 w-full sm:w-auto"
                >
                  Zapytaj o ofertę
                </Link>
              </motion.div>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mb-6 h-px bg-gradient-to-r from-[#CC1111]/30 via-[#334155] to-transparent origin-left"
            />

            {/* Clients bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              <span className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">
                Obsługujemy:
              </span>
              {clients.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[#64748B] text-sm">
                  <Icon className="w-4 h-4 text-[#CC1111]" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ===== RIGHT COLUMN — showcase ===== */}
          <div className="hidden lg:flex items-center justify-end">
            <ShowcasePanel reduced={reduced} />
          </div>
        </div>
      </div>
    </section>
  );
}
