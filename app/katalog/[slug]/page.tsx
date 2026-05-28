import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, Phone, Mail } from "lucide-react";

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex py-2.5 border-b border-gray-100 last:border-0">
      <dt className="w-44 shrink-0 text-sm text-[#64748B]">{label}</dt>
      <dd className="text-sm font-medium text-[#0F172A]">{value}</dd>
    </div>
  );
}

export default async function ProduktPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: p } = await supabase
    .from("produkty")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!p) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/katalog"
        className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#CC1111] transition-colors duration-200 cursor-pointer mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Wróć do katalogu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Zdjęcie */}
        <div className="relative h-72 md:h-auto min-h-64 rounded-2xl overflow-hidden bg-[#F1F5F9] flex items-center justify-center">
          {p.zdjecie_url ? (
            <Image
              src={p.zdjecie_url}
              alt={p.nazwa}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <Package className="w-20 h-20 text-[#CBD5E1]" aria-hidden="true" />
          )}
        </div>

        {/* Główne info + CTA */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {p.kategoria && (
              <Badge className="bg-[#FFF1F1] text-[#CC1111] border-0 hover:bg-[#FFF1F1]">
                {p.kategoria}
              </Badge>
            )}
            {p.podkategoria && (
              <Badge variant="outline" className="text-[#64748B]">
                {p.podkategoria}
              </Badge>
            )}
          </div>

          <h1
            className="text-3xl font-bold text-[#0F172A] mb-1 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {p.nazwa}
          </h1>

          {p.znacznik && (
            <p className="text-sm text-[#64748B] mb-4">{p.znacznik}</p>
          )}

          {p.opis && (
            <p className="text-[#475569] leading-relaxed mb-5">{p.opis}</p>
          )}

          <div className="bg-[#F8FAFC] rounded-xl p-5 border border-gray-200 mb-6">
            {p.cena_netto && p.cena_netto > 0 ? (
              <>
                <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mb-1">Cena netto</p>
                <p className="text-3xl font-bold text-[#0F172A]">
                  {Number(p.cena_netto).toFixed(2)} zł
                  {p.jednostka && (
                    <span className="text-base font-normal text-[#64748B] ml-1">/ {p.jednostka}</span>
                  )}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">Cena hurtowa netto. Skontaktuj się po warunki współpracy.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[#0F172A] mb-1">Cena dostępna po kontakcie</p>
                <p className="text-sm text-[#64748B]">Skontaktuj się z nami, aby uzyskać cenę hurtową.</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/kontakt?produkt=${encodeURIComponent(p.nazwa)}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#CC1111] text-white font-semibold hover:bg-[#AA0000] transition-colors duration-200 cursor-pointer"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              Zapytaj o produkt
            </Link>
            <a
              href="tel:+48000000000"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-200 text-[#334155] font-medium hover:border-[#CC1111] hover:text-[#CC1111] transition-colors duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Zadzwoń
            </a>
          </div>
        </div>
      </div>

      {/* Szczegóły produktu */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2
          className="text-lg font-bold text-[#0F172A] mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Szczegóły produktu
        </h2>
        <dl>
          <Row label="Indeks ERP" value={p.indeks_erp} />
          <Row label="Kod kreskowy" value={p.kod_kreskowy} />
          <Row label="Marka" value={p.marka} />
          <Row label="Znacznik" value={p.znacznik} />
          <Row label="Grupa" value={p.kategoria} />
          <Row label="Podgrupa" value={p.podkategoria} />
          <Row label="Podpodgrupa" value={p.podpodgrupa} />
          <Row label="Jednostka miary" value={p.jednostka} />
          <Row label="Waga netto" value={p.waga_netto} />
          <Row label="Waga brutto" value={p.waga_brutto} />
          <Row label="Karton (szt.)" value={p.karton} />
          <Row label="Skład" value={p.sklad} />
          <Row label="Kod PKWiU" value={p.kod_pkwiu} />
          <Row label="Rodzaj koncesji" value={p.rodzaj_koncesji} />
          <Row label="Data ważności (min.)" value={p.data_waznosci_min} />
        </dl>
      </div>
    </div>
  );
}
