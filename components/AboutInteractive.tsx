"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

type Milestone = {
  year: string;
  tab: string;
  image: string;
  alt: string;
  title: string;
  desc: string;
  stats: { value: string; label: string }[];
};

const milestones: Milestone[] = [
  {
    year: "2003",
    tab: "Początek",
    image: IMAGES.produce,
    alt: "Świeże owoce i warzywa na ladzie",
    title: "Rodzinna hurtownia w Szczecinie",
    desc: "Zaczęliśmy od małego magazynu owoców i warzyw oraz jednego przekonania: świeżość i uczciwa cena obronią się same. Każdą dostawę sprawdzaliśmy osobiście. Tak zostało do dziś.",
    stats: [{ value: "1", label: "magazyn" }, { value: "100%", label: "rodzinnie" }],
  },
  {
    year: "2010",
    tab: "Rozwój",
    image: IMAGES.retailShop,
    alt: "Alejka sklepu spożywczego",
    title: "Pierwsi duzi partnerzy",
    desc: "Lata budowania reputacji przyniosły efekt. Zaufały nam lokalne sieci sklepów i restauracje. To był dowód, że rodzinny model obsługi działa również na większą skalę.",
    stats: [{ value: "50+", label: "stałych partnerów" }, { value: "7:00", label: "start dostaw" }],
  },
  {
    year: "Dziś",
    tab: "Pełna oferta",
    image: IMAGES.logistics,
    alt: "Magazyn logistyczny z paletami",
    title: "Cały asortyment spożywczy",
    desc: "Z hurtowni owocowo-warzywnej wyrośliśmy w pełnoprawnego dostawcę branży spożywczej. Napoje, nabiał, słodycze, wędliny, chemia, pieczywo. Ponad 10 000 produktów u jednego partnera.",
    stats: [{ value: "10 000+", label: "produktów" }, { value: "48 h", label: "czas dostawy" }],
  },
  {
    year: "Jutro",
    tab: "Nowe rynki",
    image: IMAGES.retailAisle,
    alt: "Półki sklepowe z produktami",
    title: "Kolejne oddziały i rynki",
    desc: "Obsługujemy dziś głównie Zachodniopomorskie, ale jesteśmy gotowi na całą Polskę. Otwieramy nowe oddziały i skracamy drogę między producentem a Twoim biznesem.",
    stats: [{ value: "300+", label: "partnerów" }, { value: "PL", label: "zasięg docelowy" }],
  },
];

export function AboutInteractive() {
  const [active, setActive] = useState(2); // domyślnie "Dziś"
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = milestones[active];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight"
      ? (active + 1) % milestones.length
      : (active - 1 + milestones.length) % milestones.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="o-nas" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Nagłówek */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#E23744]" aria-hidden="true" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E23744]">O nas</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#171717] tracking-[-0.02em] leading-[1.05]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Rodzinna hurtownia, która urosła razem z klientami
          </h2>
          <p className="mt-5 text-lg text-[#52525B] leading-relaxed">
            Ponad dwie dekady konsekwencji. Prześledź, jak z jednego magazynu staliśmy się
            partnerem zaopatrzeniowym setek firm.
          </p>
        </div>

        {/* Zakładki — grid 4 kolumny: mieszczą się bez przewijania (też na telefonie) */}
        <div
          role="tablist"
          aria-label="Historia firmy Fruit"
          onKeyDown={onKeyDown}
          className="grid grid-cols-4 border-b border-[#EAEAEC]"
        >
          {milestones.map((m, i) => {
            const isActive = i === active;
            return (
              <button
                key={m.year}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                id={`about-tab-${i}`}
                aria-selected={isActive}
                aria-controls="about-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative px-2 sm:px-5 py-3 sm:py-4 text-left cursor-pointer outline-none focus-visible:bg-[#F6F6F7] transition-colors duration-200 ${
                  isActive ? "text-[#171717]" : "text-[#A1A1AA] hover:text-[#52525B]"
                }`}
              >
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">{m.year}</span>
                <span className="block mt-1 text-xs sm:text-sm font-semibold leading-tight">{m.tab}</span>
                <span
                  className={`absolute left-0 right-0 -bottom-px h-0.5 bg-[#E23744] transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* Panel: przełącza się natychmiast; key wymusza subtelny fade na CSS */}
        <div
          key={active}
          role="tabpanel"
          id="about-panel"
          aria-labelledby={`about-tab-${active}`}
          className="border border-t-0 border-[#EAEAEC] grid grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Obraz */}
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] bg-[#F6F6F7] order-1 lg:order-2">
            <Image
              src={current.image}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Treść */}
          <div className="p-6 sm:p-11 order-2 lg:order-1 flex flex-col">
            <span className="text-sm font-bold text-[#A1A1AA] uppercase tracking-widest mb-4">{current.year}</span>
            <h3
              className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-[-0.01em] mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {current.title}
            </h3>
            <p className="text-[17px] text-[#52525B] leading-relaxed">{current.desc}</p>

            <div className="mt-auto pt-8 flex gap-10">
              {current.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                    {s.value}
                  </p>
                  <p className="text-sm text-[#71717A] mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
