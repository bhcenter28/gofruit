import { supabase, type Produkt } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Upload, Pencil, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminLogout } from "@/components/AdminLogout";
import { SyncSelliTemButton } from "@/components/SyncSelliTemButton";

export default async function AdminProduktyPage({
  searchParams,
}: {
  searchParams: Promise<{ szukaj?: string; kategoria?: string }>;
}) {
  const { szukaj = "", kategoria = "" } = await searchParams;

  let query = supabase.from("produkty").select("*").order("nazwa");
  if (szukaj) query = query.ilike("nazwa", `%${szukaj}%`);
  if (kategoria) query = query.eq("kategoria", kategoria);

  const { data } = await query;
  const produkty: Produkt[] = data ?? [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Admin header */}
      <header className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-[#CC1111]" aria-hidden="true" />
          <span className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Panel admina
          </span>
          <span className="text-[#64748B]">/</span>
          <span className="text-[#94A3B8] text-sm">Produkty</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Wróć do strony
          </Link>
          <AdminLogout />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between">
          <form method="GET" className="flex gap-2 flex-1 max-w-sm">
            <input
              name="szukaj"
              defaultValue={szukaj}
              placeholder="Szukaj produktów..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1111]"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              Szukaj
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            <SyncSelliTemButton />
            <Link
              href="/admin/produkty/import"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg text-[#334155] hover:border-[#CC1111] hover:text-[#CC1111] transition-colors duration-200 cursor-pointer bg-white"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              Import CSV
            </Link>
            <Link
              href="/admin/produkty/nowy"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-[#CC1111] text-white rounded-lg hover:bg-[#AA0000] transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Nowy produkt
            </Link>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-medium text-[#334155]">
              {produkty.length} produktów
            </p>
          </div>
          {produkty.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-[#64748B]">Brak produktów. Dodaj pierwszy lub zaimportuj z CSV.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Nazwa
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">
                      Kategoria
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">
                      Indeks ERP
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produkty.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors duration-150">
                      <td className="px-5 py-3 font-medium text-[#0F172A]">{p.nazwa}</td>
                      <td className="px-5 py-3 text-[#64748B] hidden sm:table-cell">
                        {p.kategoria ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-[#64748B] font-mono text-xs hidden md:table-cell">
                        {p.indeks_erp ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            p.dostepny
                              ? "bg-green-50 text-green-700 border-0"
                              : "bg-gray-100 text-gray-500 border-0"
                          }
                        >
                          {p.dostepny ? "Dostępny" : "Niedostępny"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/admin/produkty/${p.id}`}
                          className="inline-flex items-center gap-1 text-xs text-[#CC1111] hover:text-[#AA0000] transition-colors duration-150 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          Edytuj
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
