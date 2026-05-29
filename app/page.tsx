import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fruit – Hurtownia Produktów Spożywczych | Szczecin",
  description: "Hurtownia spożywcza Fruit – ponad 10 000 produktów dla sklepów, restauracji i stacji benzynowych. Szczecin i cała Polska. Dostawa 48h, ceny hurt.",
  alternates: { canonical: "https://gofruit.pl" },
  openGraph: {
    title: "Fruit – Hurtownia Produktów Spożywczych",
    description: "Ponad 10 000 produktów spożywczych. Szybka dostawa. Konkurencyjne ceny. Działamy od 2003 r.",
    url: "https://gofruit.pl",
  },
};
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Award,
  Users,
  ChevronRight,
  TrendingUp,
  Store,
  UtensilsCrossed,
  Fuel,
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/FadeIn";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HomeCTA } from "@/components/HomeCTA";

const stats = [
  { to: 20,  suffix: "+",     label: "Lat na rynku" },
  { to: 10,  suffix: " 000+", label: "Produktów w ofercie" },
  { to: 300, suffix: "+",     label: "Stałych partnerów" },
];

const timeline = [
  {
    year: "2003",
    title: "Narodziny Fruit",
    desc: "Rodzina zakłada w Szczecinie hurtownię owoców i warzyw. Mały magazyn, wielkie ambicje i jedno przekonanie — świeżość i uczciwa cena są najlepszą wizytówką.",
  },
  {
    year: "2010",
    title: "Pierwsi duzi klienci",
    desc: "Lata budowania reputacji przynoszą efekt — sieci handlowe i duże restauracje zaczynają ufać Fruit. Przełom, który potwierdza, że rodzinny model działa na każdą skalę.",
  },
  {
    year: "Niedawno",
    title: "Pełna oferta spożywcza",
    desc: "Z hurtowni stricte owocowo-warzywnej stajemy się pełnoprawnym dostawcą całej branży spożywczej. Ponad 10 000 produktów, jeden sprawdzony partner.",
  },
  {
    year: "Dziś",
    title: "Nowe filie, nowe rynki",
    desc: "Otwieramy kolejne oddziały i wchodzimy na nowe rynki. Obsługujemy głównie Zachodniopomorskie, ale jesteśmy gotowi na całą Polskę — i nie tylko.",
  },
];

const values = [
  {
    Icon: ShieldCheck,
    color: "#CC1111",
    title: "Jakość i świeżość",
    desc: "Owoce i warzywa trafiają do Ciebie prosto od sprawdzonych producentów. Codziennie weryfikujemy każdą dostawę.",
  },
  {
    Icon: Truck,
    color: "#3B82F6",
    title: "Terminowe dostawy",
    desc: "Zamówienia realizujemy sprawnie i punktualnie. Harmonogram dopasowujemy do potrzeb każdego partnera.",
  },
  {
    Icon: Award,
    color: "#F59E0B",
    title: "Najniższe ceny",
    desc: "Ponad 20 lat relacji z producentami = jedne z najniższych cen w Polsce. Oszczędzasz realnie.",
  },
  {
    Icon: TrendingUp,
    color: "#10B981",
    title: "Stały rozwój",
    desc: "Nowe filie, nowe rynki. Obsługujemy Zachodniopomorskie i jesteśmy gotowi na całą Polskę.",
  },
];

const clients = [
  {
    Icon: Store,
    title: "Sklepy spożywcze",
    desc: "Od małego osiedlowego sklepiku po duże sieci handlowe — regularnie, terminowo, z szerokim asortymentem.",
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
    title: "Stacje i convenience",
    desc: "Napoje, przekąski, owoce, warzywa — kompleksowe zaopatrzenie dopasowane do specyfiki punktu.",
    color: "#10B981",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Kategorie */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-[#CC1111] uppercase tracking-widest mb-2">Asortyment</p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0F172A]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Kategorie produktów
              </h2>
            </div>
            <Link
              href="/katalog"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#CC1111] hover:text-[#AA0000] transition-colors duration-200 cursor-pointer"
            >
              Wszystkie produkty
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </FadeIn>
        <CategoryGrid />
      </section>

      {/* Stats */}
      <section className="bg-[#0A111E] border-y border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1.5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-xs text-[#475569] uppercase tracking-widest">{s.label}</div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* O nas — pełna historia */}
      <section id="o-nas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
          <div
            className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#CC1111]/40 via-[#CC1111]/20 to-transparent"
            aria-hidden="true"
          />
          <div className="space-y-12">
            {timeline.map(({ year, title, desc }, i) => (
              <FadeIn key={year} direction={i % 2 === 0 ? "left" : "right"}>
                <div className={`relative flex items-start gap-8 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#CC1111] border-4 border-white shadow-lg shadow-[#CC1111]/30 z-10 mt-1.5" aria-hidden="true" />
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
                  <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Co nas wyróżnia */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-[#CC1111] uppercase tracking-widest mb-2">Co nas wyróżnia</p>
              <h2
                className="text-3xl sm:text-4xl font-black text-[#0F172A]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Dlaczego Fruit?
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

      {/* Kogo obsługujemy */}
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

      <HomeCTA />
    </>
  );
}
