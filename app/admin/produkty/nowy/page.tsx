import { ProduktForm } from "@/components/ProduktForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NowyProduktPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/produkty"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#CC1111] transition-colors duration-200 cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Wróć do listy
        </Link>
        <h1
          className="text-2xl font-bold text-[#0F172A] mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Nowy produkt
        </h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ProduktForm />
        </div>
      </div>
    </div>
  );
}
