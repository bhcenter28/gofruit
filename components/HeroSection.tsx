"use client";

import Image from "next/image";
import { useContactModal } from "@/lib/contact-modal";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/images";

const serve = ["Sklepy", "Gastronomia", "Stacje paliw"];

export function HeroSection() {
  const { open: openModal } = useContactModal();

  return (
    <section className="relative min-h-[88vh] flex items-end sm:items-center bg-[#171717] text-white overflow-hidden">
      {/* Zdjęcie tła */}
      <Image
        src={IMAGES.heroWarehouse}
        alt="Magazyn hurtowni spożywczej Fruit, wysokie regały z towarem"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Przyciemnienie pod tekst */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:hidden" aria-hidden="true" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#E23744]" aria-hidden="true" />
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80">
              Hurtownia spożywcza od 2003
            </span>
          </div>

          {/* Nagłówek */}
          <h1
            className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem] font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Zaopatrzenie spożywcze
            <br />
            dla Twojego <span className="text-[#FF3B47]">biznesu</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
            Pełen asortyment dla sklepów, gastronomii i stacji paliw. Ponad 10 000 produktów,
            uczciwe ceny i dostawa, na której możesz polegać.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openModal()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E23744] text-white font-semibold text-[15px] hover:bg-[#C42130] transition-colors duration-200 cursor-pointer"
            >
              Zapytaj o ofertę
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
            </button>
            <a
              href="#dostawa"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold text-[15px] hover:bg-white hover:text-[#171717] transition-colors duration-200"
            >
              Zobacz, jak działamy
            </a>
          </div>

          {/* Obsługujemy */}
          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Obsługujemy</span>
            {serve.map((s, i) => (
              <span key={s} className="flex items-center gap-3">
                {i > 0 && <span className="w-1 h-1 bg-white/40" aria-hidden="true" />}
                <span className="font-medium">{s}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
