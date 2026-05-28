"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContactModal } from "@/lib/contact-modal";

const links = [
  { href: "/katalog", label: "Katalog" },
  { href: "/#o-nas",  label: "O nas" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { open: openModal } = useContactModal();

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] border-b border-[#1E293B]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative"
            >
              <Image src="/logo.png" alt="Fruit" width={46} height={46} className="rounded-lg" priority />
            </motion.div>
            <div className="hidden sm:block">
              <p
                className="font-bold text-base leading-none text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Fruit
              </p>
              <p className="text-xs leading-none mt-0.5 text-white/40">
                Hurtownia Spożywcza
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Główna nawigacja">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? "text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#CC1111]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="w-px h-5 mx-2 bg-white/15" />

            <a
              href="tel:+48000000000"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              +48 000 000 000
            </a>

            <div className="w-px h-5 mx-1 bg-white/15" />

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="ml-1">
              <button
                onClick={() => openModal()}
                className="px-5 py-2 rounded-lg text-sm font-bold bg-[#CC1111] text-white hover:bg-[#AA0000] transition-colors duration-200 cursor-pointer shadow-md shadow-[#CC1111]/20"
              >
                Kontakt
              </button>
            </motion.div>
          </nav>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="tel:+48000000000"
              className="p-2 rounded-lg text-white/60 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
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
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
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
                    className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                      pathname === link.href
                        ? "bg-[#FFF1F1] text-[#CC1111]"
                        : "text-[#334155] hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#CC1111]" />
                    )}
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
                  className="w-full block px-3 py-3 rounded-xl text-sm font-bold bg-[#CC1111] text-white text-center hover:bg-[#AA0000] transition-colors shadow-md shadow-[#CC1111]/20 cursor-pointer"
                >
                  Kontakt
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
