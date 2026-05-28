"use client";

import {
  ShieldCheck, Truck, Clock, Award,
  ArrowRight, Store, UtensilsCrossed, Fuel,
  MapPin, Package, TrendingUp,
} from "lucide-react";
import { useContactModal } from "@/lib/contact-modal";
import { motion, useReducedMotion } from "framer-motion";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/FadeIn";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const values = [
  {
    Icon: ShieldCheck,
    color: "#CC1111",
    title: "Jakość i świeżość",
    desc: "Owoce i warzywa trafiają do Ciebie prosto od sprawdzonych producentów. Codziennie weryfikujemy każdą dostawę — żadnych kompromisów.",
  },
  {
    Icon: Truck,
    color: "#3B82F6",
    title: "Terminowe dostawy",
    desc: "Zamówienia realizujemy sprawnie i punktualnie. Nasze harmonogramy dopasowujemy do grafiku i potrzeb każdego partnera.",
  },
  {
    Icon: Award,
    color: "#F59E0B",
    title: "Najniższe ceny",
    desc: "Ponad 20 lat relacji z producentami przekłada się na wyjątkowo korzystne warunki zakupu — oszczędzasz realnie, bez kompromisów jakościowych.",
  },
  {
    Icon: TrendingUp,
    color: "#10B981",
    title: "Stały rozwój",
    desc: "Otwieramy nowe filie i wchodzimy na nowe rynki. Dziś obsługujemy region zachodniopomorski, jutro — całą Polskę i nie tylko.",
  },
];

const clients = [
  {
    Icon: Store,
    title: "Sklepy spożywcze",
    desc: "Od małego osiedlowego sklepiku po duże sieci handlowe — dostarczamy regularnie, terminowo i z szerokim asortymentem.",
    color: "#CC1111",
  },
  {
    Icon: UtensilsCrossed,
    title: "Gastronomia",
    desc: "Restauracje, bary, catering — świeże owoce i warzywa oraz pełna oferta spożywcza prosto do kuchni.",
    color: "#3B82F6",
  },
  {
    Icon: Fuel,
    title: "Stacje benzynowe i sklepy convenience",
    desc: "Napoje, przekąski, owoce, warzywa — kompletne zaopatrzenie dopasowane do specyfiki punktu sprzedaży.",
    color: "#10B981",
  },
];

const timeline = [
  { year: "2003", title: "Narodziny Fruit", desc: "Rodzina zakłada w Szczecinie pierwszą hurtownię owoców i warzyw w regionie. Mały magazyn, wielkie ambicje i jedno przekonanie — świeżość i uczciwa cena są najlepszą wizytówką." },
  { year: "2010", title: "Pierwsi duzi klienci", desc: "Lata budowania reputacji przynoszą efekt — sieci handlowe i duże restauracje zaczynają ufać Fruit. To przełom, który potwierdza, że rodzinny model działa na każdą skalę." },
  { year: "Niedawno", title: "Pełna oferta spożywcza", desc: "Z hurtowni stricte owocowo-warzywnej stajemy się pełnoprawnym dostawcą całej branży spożywczej. Ponad 10 000 produktów, jeden sprawdzony partner." },
  { year: "Dziś", title: "Nowe filie, nowe rynki", desc: "Otwieramy kolejne oddziały i wchodzimy na nowe rynki. Obsługujemy głównie Zachodniopomorskie, ale jesteśmy gotowi na całą Polskę — i nie tylko." },
];

const stats = [
  { to: 20,  suffix: "+",    label: "Lat na rynku" },
  { to: 10,  suffix: " 000+", label: "Produktów w ofercie" },
  { to: 300, suffix: "+",    label: "Stałych partnerów" },
  { to: 1,   suffix: " dzień", label: "Czas odpowiedzi" },
];

export default function ONasPage() {
  const reduced = useReducedMotion();
  const { open: openModal } = useContactModal();

  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section className="relative bg-[#0F172A] text-white overflow-hidden py-28 sm:py-36">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(to right,#fff 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />
        {/* Glows */}
        <motion.div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.09] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#CC1111 0%,transparent 65%)" }}
          animate={reduced ? {} : { scale: [1,1.12,1], opacity: [0.07,0.13,0.07] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle,#3B82F6 0%,transparent 65%)" }}
          animate={reduced ? {} : { scale: [1,1.15,1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CC1111]/12 border border-[#CC1111]/25 text-[#FCA5A5] text-sm font-semibold mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#CC1111]" />
            Poznaj nas
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.21,0.47,0.32,0.98] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 max-w-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Jesteśmy{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#EF4444 0%,#CC1111 50%,#991111 100%)" }}
            >
              FRUIT
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg text-[#94A3B8] max-w-2xl leading-relaxed mb-10"
          >
            Rodzinna hurtownia owoców, warzyw i produktów spożywczych z ponad 20-letnim
            doświadczeniem. Od 2003 roku budujemy trwałe partnerstwa — od małych sklepów
            po duże sieci handlowe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { Icon: MapPin,    text: "Zachodniopomorskie i cała Polska" },
              { Icon: Package,   text: "10 000+ produktów" },
              { Icon: Award,     text: "Jedne z najniższych cen w Polsce" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-[#64748B]">
                <Icon className="w-4 h-4 text-[#CC1111]" aria-hidden="true" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="bg-[#0A111E] border-y border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <p
                  className="text-4xl sm:text-5xl font-black text-white mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </p>
                <p className="text-xs text-[#475569] uppercase tracking-widest">{s.label}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ══════════ HISTORIA — TIMELINE ══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <FadeIn>
          <div className="mb-14">
            <p className="text-xs font-bold text-[#CC1111] uppercase tracking-widest mb-2">Nasza historia</p>
            <h2
              className="text-3xl sm:text-4xl font-black text-[#0F172A]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ponad 20 lat tradycji
            </h2>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#CC1111]/40 via-[#CC1111]/20 to-transparent" aria-hidden="true" />

          <div className="space-y-12">
            {timeline.map(({ year, title, desc }, i) => (
              <FadeIn key={year} direction={i % 2 === 0 ? "left" : "right"}>
                <div className={`relative flex items-start gap-8 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#CC1111] border-4 border-white shadow-lg shadow-[#CC1111]/30 z-10 mt-1.5" aria-hidden="true" />

                  {/* Content card */}
                  <div className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? "sm:pr-12" : "sm:pl-12"}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300">
                      <span
                        className="inline-block text-xs font-black text-[#CC1111] uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
                        style={{ background: "#CC111112" }}
                      >
                        {year}
                      </span>
                      <h3
                        className="text-lg font-black text-[#0F172A] mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {title}
                      </h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WARTOŚCI ══════════ */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-[#CC1111] uppercase tracking-widest mb-2">Co nas wyróżnia</p>
              <h2
                className="text-3xl sm:text-4xl font-black text-[#0F172A]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Nasze wartości
              </h2>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ Icon, color, title, desc }) => (
              <StaggerItem key={title}>
                <div className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color }} aria-hidden="true" />
                  </div>
                  <h3
                    className="font-black text-[#0F172A] mb-2 text-base"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed flex-1">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ══════════ DLA KOGO ══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#CC1111] uppercase tracking-widest mb-2">Nasi klienci</p>
            <h2
              className="text-3xl sm:text-4xl font-black text-[#0F172A]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Kogo obsługujemy
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {clients.map(({ Icon, title, desc, color }) => (
            <StaggerItem key={title}>
              <div className="group relative bg-[#0F172A] rounded-2xl p-8 overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-all duration-300">
                {/* Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(300px circle at 50% 0%,${color}20,transparent 70%)` }}
                  aria-hidden="true"
                />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} aria-hidden="true" />
                </div>
                <h3
                  className="text-lg font-black text-white mb-3 relative"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed relative flex-1">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
        <FadeIn>
          <div className="relative bg-[#0F172A] rounded-3xl p-10 sm:p-16 text-center text-white overflow-hidden">
            <div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle,#CC1111 0%,transparent 60%)" }}
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-xs font-bold text-[#CC1111] uppercase tracking-widest mb-3">Zaczynamy?</p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Porozmawiajmy o współpracy
              </h2>
              <p className="text-[#64748B] mb-8 max-w-lg mx-auto text-sm leading-relaxed">
                Skontaktuj się z nami — przedstawimy ofertę dopasowaną do Twojego biznesu i uszczegółowimy warunki współpracy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#CC1111] text-white font-bold hover:bg-[#AA0000] transition-colors duration-200 shadow-lg shadow-[#CC1111]/30 text-sm cursor-pointer"
                >
                  Skontaktuj się
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <a
                  href="/katalog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-[#1E293B] text-[#94A3B8] font-semibold hover:border-[#334155] hover:text-white transition-all duration-200 text-sm"
                >
                  Przeglądaj katalog
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
