import type { Metadata } from "next";
import Image from "next/image";
import {
  Droplets, Milk, Candy, Ham, Wheat, Apple, Snowflake, FlaskConical,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroSection } from "@/components/HeroSection";
import { FeatureRow } from "@/components/FeatureRow";
import { AboutInteractive } from "@/components/AboutInteractive";
import { ClientCards } from "@/components/ClientCards";
import { ContactForm } from "@/components/ContactForm";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Fruit – Hurtownia Produktów Spożywczych | Szczecin",
  description:
    "Hurtownia spożywcza Fruit – pełen asortyment dla sklepów, gastronomii i stacji paliw. Szczecin i cała Polska. Dostawa 48 h, ceny hurtowe. Zapytaj o ofertę.",
  alternates: { canonical: "https://gofruit.pl" },
  openGraph: {
    title: "Fruit – Hurtownia Produktów Spożywczych",
    description: "Ponad 10 000 produktów spożywczych. Szybka dostawa. Uczciwe ceny. Działamy od 2003 r.",
    url: "https://gofruit.pl",
  },
};

const stats = [
  { to: 20,  suffix: "+",     label: "Lat na rynku" },
  { to: 10,  suffix: " 000+", label: "Produktów w ofercie" },
  { to: 300, suffix: "+",     label: "Stałych partnerów" },
  { to: 48,  suffix: " h",    label: "Czas dostawy" },
];

const assortment = [
  { Icon: Droplets,     name: "Napoje" },
  { Icon: Milk,         name: "Nabiał" },
  { Icon: Candy,        name: "Słodycze" },
  { Icon: Ham,          name: "Wędliny" },
  { Icon: Wheat,        name: "Pieczywo" },
  { Icon: Apple,        name: "Owoce i warzywa" },
  { Icon: Snowflake,    name: "Mrożonki" },
  { Icon: FlaskConical, name: "Chemia" },
];

const steps = [
  { no: "01", title: "Wysyłasz zapytanie", desc: "Napisz, jakich produktów potrzebujesz i w jakiej ilości. Wystarczy krótka wiadomość." },
  { no: "02", title: "Otrzymujesz ofertę", desc: "W ciągu jednego dnia roboczego przygotujemy wycenę dopasowaną do Twojej firmy." },
  { no: "03", title: "Dostarczamy towar",  desc: "Realizujemy zamówienie punktualnie, w stałym, wygodnym dla Ciebie harmonogramie." },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* ── Pasek statystyk ── */}
      <section className="border-b border-[#EAEAEC] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#EAEAEC]">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center px-2 ${i < 2 ? "border-b lg:border-b-0 border-[#EAEAEC] pb-6 lg:pb-0" : ""}`}>
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] mb-1.5 tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-xs text-[#71717A] uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Oferta: świeże produkty ── */}
      <FeatureRow
        id="oferta"
        image={IMAGES.produce}
        alt="Świeże owoce i warzywa na sklepowej ladzie"
        eyebrow="Asortyment"
        title="Świeżość prosto od producenta"
        desc="Zaczynaliśmy od owoców i warzyw — i to wciąż nasza mocna strona. Dziś dokładamy do tego cały koszyk spożywczy, żeby zaopatrzyć Cię u jednego partnera."
        bullets={[
          "Owoce i warzywa dostarczane codziennie",
          "Nabiał, wędliny i mrożonki w pełnym łańcuchu chłodniczym",
          "Napoje, słodycze, pieczywo i chemia — wszystko na jednej fakturze",
        ]}
        cta={{ href: "#kontakt", label: "Zapytaj o asortyment" }}
      />

      {/* ── Kategorie (asortyment w skrócie) ── */}
      <section className="bg-[#F6F6F7] border-y border-[#EAEAEC] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Główne grupy produktów
            </h2>
            <p className="text-sm text-[#71717A]">Nie prowadzimy sprzedaży detalicznej — obsługujemy wyłącznie firmy.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#EAEAEC] border border-[#EAEAEC]">
            {assortment.map(({ Icon, name }) => (
              <div key={name} className="flex items-center gap-3.5 bg-white px-5 py-5">
                <Icon className="w-5 h-5 text-[#E23744] shrink-0" aria-hidden="true" />
                <span className="text-[15px] font-semibold text-[#171717]">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O nas — interaktywne ── */}
      <AboutInteractive />

      {/* ── Dostawa / logistyka ── */}
      <div className="bg-[#F6F6F7] border-y border-[#EAEAEC]">
        <FeatureRow
          id="dostawa"
          image={IMAGES.logistics}
          alt="Magazyn logistyczny hurtowni z paletami i regałami"
          eyebrow="Dostawa"
          title="Logistyka, na której polegasz"
          desc="Zamówienia realizujemy sprawnie i punktualnie, w harmonogramie dopasowanym do Twojego biznesu. Bez przestojów na półce i bez niespodzianek."
          bullets={[
            "Dostawa w 48 godzin na terenie kraju",
            "Stały, powtarzalny harmonogram dostaw",
            "Pełna kontrola jakości przed wysyłką",
          ]}
          imageRight
        />
      </div>

      {/* ── Współpraca w 3 krokach ── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#E23744]" aria-hidden="true" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E23744]">Jak działamy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-[-0.02em] mb-12" style={{ fontFamily: "var(--font-heading)" }}>
            Współpraca w trzech krokach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map(({ no, title, desc }) => (
              <div key={no} className="border-t-2 border-[#171717] pt-6">
                <span className="block text-5xl font-extrabold text-[#E23744] leading-none mb-5 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  {no}
                </span>
                <h3 className="text-xl font-bold text-[#171717] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  {title}
                </h3>
                <p className="text-[15px] text-[#52525B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kogo obsługujemy ── */}
      <section className="bg-white pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#E23744]" aria-hidden="true" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E23744]">Nasi klienci</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-[-0.02em] mb-10" style={{ fontFamily: "var(--font-heading)" }}>
            Kogo zaopatrujemy
          </h2>
          <ClientCards />
        </div>
      </section>

      {/* ── Baner: świeżość ── */}
      <section className="relative bg-[#F6F6F7]">
        <div className="relative h-[360px] sm:h-[440px] w-full">
          <Image src={IMAGES.freshFlatlay} alt="Świeże owoce — truskawki, cytrusy, jagody" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-white via-white/85 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0">
            <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end">
              <div className="max-w-md text-right">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-[-0.02em] leading-[1.1]" style={{ fontFamily: "var(--font-heading)" }}>
                  Świeżość, na której<br />możesz polegać
                </h2>
                <p className="mt-4 text-[17px] text-[#52525B] leading-relaxed">
                  Każdą dostawę weryfikujemy przed wysyłką. Bo Twoja reputacja zaczyna się na naszej półce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Zapytaj o ofertę ── */}
      <section id="kontakt" className="scroll-mt-16 bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#E23744]" aria-hidden="true" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E23744]">Zaczynamy współpracę</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#171717] tracking-[-0.02em] leading-[1.05]" style={{ fontFamily: "var(--font-heading)" }}>
              Zapytaj o ofertę dla swojej firmy
            </h2>
            <p className="mt-5 text-lg text-[#52525B] leading-relaxed">
              Wypełnij formularz albo zadzwoń — przygotujemy wycenę dopasowaną do Twojego
              asortymentu i skali. Bez zobowiązań.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
