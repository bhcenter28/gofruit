"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Candy,
  Milk,
  FlaskConical,
  Wheat,
  Ham,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categories: { name: string; kat: string; count: number; Icon: LucideIcon; color: string }[] = [
  { name: "NAPOJE",    kat: "NAPOJE",    count: 1011, Icon: Droplets,     color: "#3B82F6" },
  { name: "SŁODYCZE",  kat: "SŁODYCZE",  count: 1122, Icon: Candy,        color: "#EC4899" },
  { name: "NABIAŁ",    kat: "NABIAŁ",    count: 1240, Icon: Milk,         color: "#8B5CF6" },
  { name: "WĘDLINY",   kat: "WĘDLINY",   count: 1445, Icon: Ham,          color: "#EF4444" },
  { name: "CHEMIA",    kat: "CHEMIA",    count: 1722, Icon: FlaskConical, color: "#10B981" },
  { name: "PIEKARNIA", kat: "PIEKARNIA", count: 477,  Icon: Wheat,        color: "#F59E0B" },
];

function GlowCard({ name, kat, count, Icon, color }: typeof categories[0]) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  const label = name.charAt(0) + name.slice(1).toLowerCase();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link
        ref={cardRef}
        href={`/katalog?kategoria=${encodeURIComponent(kat)}`}
        onMouseMove={handleMouseMove}
        className="group relative flex flex-col items-center p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] cursor-pointer text-center overflow-hidden block h-full"
        style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
      >
        {/* Spotlight jasny – podąża za myszą */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(260px circle at var(--mx) var(--my), ${color}30, transparent 70%)`,
          }}
        />

        {/* Glowing border – podąża za myszą */}
        <div
          className="pointer-events-none absolute rounded-2xl inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(160px circle at var(--mx) var(--my), ${color}99, transparent 65%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />

        {/* Ikona */}
        <div className="relative mb-4">
          <div
            className="absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150"
            style={{ backgroundColor: color }}
          />
          <div
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" style={{ color }} />
          </div>
        </div>

        {/* Tekst */}
        <p
          className="relative text-sm font-bold text-white leading-tight mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {label}
        </p>
        <p className="relative text-xs text-white/30 group-hover:text-white/50 transition-colors duration-300">
          {count.toLocaleString("pl-PL")} produktów
        </p>

        {/* CTA pojawia się na hover */}
        <p
          className="relative text-xs font-semibold mt-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          style={{ color }}
        >
          Przeglądaj →
        </p>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {categories.map((cat) => (
        <GlowCard key={cat.kat} {...cat} />
      ))}
    </motion.div>
  );
}
