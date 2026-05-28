"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ContactModalState {
  isOpen: boolean;
  produkt?: string;
  open: (produkt?: string) => void;
  close: () => void;
}

const ContactModalContext = createContext<ContactModalState | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [produkt, setProdukt] = useState<string | undefined>();

  return (
    <ContactModalContext.Provider value={{
      isOpen,
      produkt,
      open: (p) => { setProdukt(p); setIsOpen(true); },
      close: () => { setIsOpen(false); setProdukt(undefined); },
    }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
