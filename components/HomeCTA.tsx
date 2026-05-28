"use client";

import { ArrowRight } from "lucide-react";
import { useContactModal } from "@/lib/contact-modal";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";

export function HomeCTA() {
  const { open: openModal } = useContactModal();

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
      <FadeIn>
        <div className="relative bg-[#0F172A] rounded-3xl p-10 sm:p-16 text-center text-white overflow-hidden">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #CC1111 0%, transparent 60%)" }}
            aria-hidden="true"
          />
          <p className="text-xs font-semibold text-[#CC1111] uppercase tracking-widest mb-3 relative">Zaczynamy?</p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 relative"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Gotowy na współpracę?
          </h2>
          <p className="text-[#64748B] mb-8 max-w-lg mx-auto relative text-sm">
            Skontaktuj się z nami — przedstawimy indywidualną ofertę dopasowaną do Twojego biznesu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#CC1111] text-white font-bold hover:bg-[#AA0000] transition-colors duration-200 cursor-pointer shadow-lg shadow-[#CC1111]/30 text-sm"
            >
              Skontaktuj się
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-[#1E293B] text-[#94A3B8] font-semibold hover:border-[#334155] hover:text-white transition-all duration-200 text-sm"
            >
              Przeglądaj katalog
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
