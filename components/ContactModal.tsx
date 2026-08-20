"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { useContactModal } from "@/lib/contact-modal";

export function ContactModal() {
  const { isOpen, produkt, close } = useContactModal();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Formularz kontaktowy"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative w-full max-w-5xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                aria-label="Zamknij formularz"
                className="absolute -top-3 -right-3 z-10 w-9 h-9 bg-[#171717] hover:bg-[#E23744] flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-lg"
              >
                <X className="w-4 h-4 text-white/80" aria-hidden="true" />
              </button>

              <ContactForm produkt={produkt} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
