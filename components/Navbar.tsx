"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContactModal } from "@/lib/contact-modal";

const links = [
  { href: "/#o-nas",   label: "O nas" },
  { href: "/#oferta",  label: "Oferta" },
  { href: "/#dostawa", label: "Jak działamy" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open: openModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-b border-[#EAEAEC] shadow-[0_1px_20px_rgba(0,0,0,0.04)]" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/logo.png" alt="Fruit — hurtownia spożywcza" width={40} height={40} className="rounded-none" priority />
            <div className="hidden sm:block leading-none">
              <p className="font-bold text-[15px] text-[#171717]" style={{ fontFamily: "var(--font-heading)" }}>
                Fruit
              </p>
              <p className="text-[11px] mt-0.5 text-[#A1A1AA]">Hurtownia spożywcza</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Główna nawigacja">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-none text-sm font-medium text-[#52525B] hover:text-[#171717] hover:bg-[#F6F6F7] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-5 mx-2 bg-[#EAEAEC]" />

            <a
              href="tel:+48000000000"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#52525B] hover:text-[#171717] transition-colors duration-200"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              +48 000 000 000
            </a>

            <button
              onClick={() => openModal()}
              className="group ml-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-none text-sm font-semibold bg-[#E23744] text-white hover:bg-[#C42130] transition-colors duration-200 cursor-pointer"
            >
              Zapytaj o ofertę
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
            </button>
          </nav>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-1">
            <a
              href="tel:+48000000000"
              aria-label="Zadzwoń"
              className="p-2 rounded-none text-[#52525B] hover:text-[#171717] hover:bg-[#F6F6F7] transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              className="p-2 rounded-none text-[#171717] hover:bg-[#F6F6F7] transition-colors duration-200 cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={open}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden border-t border-[#EAEAEC] bg-white overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-none text-sm font-semibold text-[#3F3F46] hover:bg-[#F6F6F7] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: links.length * 0.06, duration: 0.25 }}
                className="mt-1"
              >
                <button
                  onClick={() => { setOpen(false); openModal(); }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-3 rounded-none text-sm font-bold bg-[#E23744] text-white text-center hover:bg-[#C42130] transition-colors cursor-pointer"
                >
                  Zapytaj o ofertę
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
