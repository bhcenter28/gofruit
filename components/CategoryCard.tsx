"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  name: string;
  kat: string;
  count: number;
  Icon: LucideIcon;
  color: string;
}

export function CategoryCard({ name, kat, count, Icon, color }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.setProperty("--glow-color", color + "55");
    card.style.setProperty("--glow-border", color + "99");
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mouse-x", `50%`);
    card.style.setProperty("--mouse-y", `50%`);
  }

  const displayName = name.charAt(0) + name.slice(1).toLowerCase();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        ref={cardRef}
        href={`/katalog?kategoria=${encodeURIComponent(kat)}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="category-glow-card group relative flex flex-col items-center p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] cursor-pointer text-center overflow-hidden block"
        style={{
          "--mouse-x": "50%",
          "--mouse-y": "50%",
          "--glow-color": color + "33",
          "--glow-border": color + "66",
        } as React.CSSProperties}
      >
        {/* Spotlight glow podążający za kursorem */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(280px circle at var(--mouse-x) var(--mouse-y), var(--glow-color), transparent 70%)",
          }}
        />

        {/* Glowing border overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), var(--glow-border), transparent 70%)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />

        {/* Ikona */}
        <motion.div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: color + "20" }}
          whileHover={{ scale: 1.12, rotate: [0, -6, 6, 0] }}
          transition={{ duration: 0.4 }}
        >
          {/* Icon glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
            style={{ backgroundColor: color + "50" }}
          />
          <Icon className="relative w-7 h-7 z-10" style={{ color }} />
        </motion.div>

        {/* Nazwa */}
        <p
          className="relative font-bold text-white text-sm leading-tight mb-1.5 transition-colors duration-200"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {displayName}
        </p>

        {/* Liczba */}
        <p className="relative text-xs text-white/30 group-hover:text-white/50 transition-colors duration-200">
          {count.toLocaleString("pl-PL")} produktów
        </p>

        {/* Strzałka */}
        <motion.p
          className="relative text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
          style={{ color }}
        >
          Przeglądaj →
        </motion.p>
      </Link>
    </motion.div>
  );
}
