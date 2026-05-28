"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const reduced = useReducedMotion();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #CC1111 0%, transparent 70%)" }}
        animate={reduced ? {} : { scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="relative text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#CC1111]/15 border border-[#CC1111]/20 flex items-center justify-center">
            <motion.div
              animate={reduced ? {} : { rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5, delay: 0.8, repeat: reduced ? 0 : Infinity, repeatDelay: 3 }}
            >
              <AlertTriangle className="w-9 h-9 text-[#CC1111]" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Coś poszło nie tak
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[#64748B] text-base max-w-sm mx-auto mb-10"
        >
          Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do strony głównej.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#CC1111] text-white font-bold text-sm hover:bg-[#AA0000] transition-colors shadow-lg shadow-[#CC1111]/25 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Spróbuj ponownie
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#1E293B] text-[#94A3B8] font-semibold text-sm hover:border-[#334155] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Strona główna
            </Link>
          </motion.div>
        </motion.div>
      </div>

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
