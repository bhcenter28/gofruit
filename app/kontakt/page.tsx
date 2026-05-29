import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z hurtownią Fruit. Zapytaj o ofertę, warunki współpracy lub złóż zamówienie. Obsługujemy sklepy, restauracje i stacje benzynowe.",
  alternates: { canonical: "https://gofruit.pl/kontakt" },
};

export default async function KontaktPage({
  searchParams,
}: {
  searchParams: Promise<{ produkt?: string }>;
}) {
  const { produkt } = await searchParams;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4 py-14 sm:py-20">
      <div className="w-full max-w-5xl">
        <ContactForm produkt={produkt} />
      </div>
    </div>
  );
}
