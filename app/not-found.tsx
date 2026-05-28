"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Home, Package, Search } from "lucide-react";

export default function NotFound() {
  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Red glow — bottom center */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-[0.12] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #CC1111 0%, transparent 70%)" }}
        animate={reduced ? {} : { opacity: [0.10, 0.18, 0.10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Top ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #CC1111 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative text-center z-10 flex flex-col items-center">

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#CC1111] blur-2xl opacity-30 scale-125" />
            <div className="relative w-20 h-20 rounded-2xl bg-[#CC1111]/15 flex items-center justify-center border border-[#CC1111]/25">
              <motion.div
                animate={reduced ? {} : { rotate: [0, -8, 8, -4, 0] }}
                transition={{ duration: 0.7, delay: 1, repeat: Infinity, repeatDelay: 4 }}
              >
                <Search className="w-9 h-9 text-[#CC1111]" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mb-2"
        >
          <span
            className="block text-[120px] sm:text-[160px] font-black leading-none text-transparent bg-clip-text select-none"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundImage: "linear-gradient(160deg, #EF4444 0%, #CC1111 40%, #7F1D1D 100%)",
              filter: "drop-shadow(0 0 60px #CC111155)",
            }}
          >
            404
          </span>

          {/* Decorative line under 404 */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC1111]/50 to-transparent"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl sm:text-3xl font-black text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ta strona zaginęła w magazynie
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="text-[#64748B] text-sm sm:text-base max-w-sm mx-auto mb-10 leading-relaxed"
        >
          Szukana strona nie istnieje lub została przeniesiona.
          Wróć do strony głównej lub przeglądaj katalog.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs sm:max-w-none"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#CC1111] text-white font-bold text-sm hover:bg-[#AA0000] transition-colors shadow-lg shadow-[#CC1111]/30 w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              Strona główna
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[#1E293B] text-[#94A3B8] font-semibold text-sm hover:border-[#334155] hover:text-white transition-all duration-200 w-full sm:w-auto"
            >
              <Package className="w-4 h-4" />
              Przeglądaj katalog
            </Link>
          </motion.div>
        </motion.div>

        {/* Subtle back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            Wróć do poprzedniej strony
          </button>
        </motion.div>
      </div>

      {/* Bottom label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-xs text-[#1E293B] font-medium tracking-widest uppercase"
      >
        Fruit Hurtownia Spożywcza
      </motion.p>
    </div>
  );
}
