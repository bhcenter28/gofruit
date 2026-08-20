"use client";

import { useState } from "react";
import { Trash2, Phone, Mail, Building2, Clock, Loader2, Inbox } from "lucide-react";
import type { Zapytanie } from "@/lib/inquiries";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ZapytaniaList({ initial }: { initial: Zapytanie[] }) {
  const [items, setItems] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Usunąć to zapytanie? Tej operacji nie można cofnąć.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/zapytania/${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
      else alert("Nie udało się usunąć zapytania.");
    } finally {
      setDeleting(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="border border-[#EAEAEC] bg-white py-20 text-center">
        <Inbox className="w-10 h-10 text-[#D4D4D8] mx-auto mb-4" aria-hidden="true" />
        <p className="text-[#52525B] font-medium">Brak zapytań</p>
        <p className="text-sm text-[#A1A1AA] mt-1">Nowe zgłoszenia z formularza pojawią się tutaj.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((z) => (
        <article key={z.id} className="border border-[#EAEAEC] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#171717] truncate" style={{ fontFamily: "var(--font-heading)" }}>
                {z.imie_nazwisko}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#71717A]">
                {z.firma && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" aria-hidden="true" /> {z.firma}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {formatDate(z.utworzono)}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(z.id)}
              disabled={deleting === z.id}
              aria-label="Usuń zapytanie"
              className="shrink-0 inline-flex items-center justify-center w-9 h-9 border border-[#EAEAEC] text-[#71717A] hover:text-[#E23744] hover:border-[#E23744] transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting === z.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href={`tel:${z.telefon.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 font-medium text-[#171717] hover:text-[#E23744] transition-colors">
              <Phone className="w-4 h-4 text-[#E23744]" aria-hidden="true" /> {z.telefon}
            </a>
            <a href={`mailto:${z.email}`} className="inline-flex items-center gap-1.5 font-medium text-[#171717] hover:text-[#E23744] transition-colors break-all">
              <Mail className="w-4 h-4 text-[#E23744]" aria-hidden="true" /> {z.email}
            </a>
          </div>

          {z.produkt && (
            <p className="mt-3 text-xs text-[#71717A]">
              Produkt: <span className="font-semibold text-[#171717] bg-[#F6F6F7] px-2 py-0.5">{z.produkt}</span>
            </p>
          )}

          <p className="mt-3 text-sm text-[#52525B] leading-relaxed whitespace-pre-wrap border-t border-[#F0F0F2] pt-3">
            {z.wiadomosc}
          </p>
        </article>
      ))}
    </div>
  );
}
