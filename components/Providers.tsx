"use client";

import { AppProgressBar } from "next-nprogress-bar";
import { ContactModalProvider } from "@/lib/contact-modal";
import { ContactModal } from "@/components/ContactModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <ContactModal />
      <AppProgressBar
        height="3px"
        color="#CC1111"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ContactModalProvider>
  );
}
