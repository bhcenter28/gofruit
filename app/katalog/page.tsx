import { supabase, type Produkt } from "@/lib/supabase";
import { ProductGrid } from "@/components/ProductGrid";
import { KatalogFilters } from "@/components/KatalogFilters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 50;

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string; szukaj?: string; strona?: string }>;
}) {
  const params = await searchParams;
  const { kategoria = "", szukaj = "", strona = "1" } = params;
  const page = Math.max(1, parseInt(strona) || 1);
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const [produktyRes, kategorieRes] = await Promise.all([
    (() => {
      let query = supabase
        .from("produkty")
        .select("*", { count: "exact" })
        .eq("dostepny", true)
        .order("nazwa")
        .range(from, to);

      if (kategoria) query = query.eq("kategoria", kategoria);

      if (szukaj) {
        query = query.or(
          `nazwa.ilike.%${szukaj}%,` +
          `marka.ilike.%${szukaj}%,` +
          `kategoria.ilike.%${szukaj}%,` +
          `znacznik.ilike.%${szukaj}%,` +
          `indeks_erp.ilike.%${szukaj}%,` +
          `kod_kreskowy.ilike.%${szukaj}%`
        );
      }

      return query;
    })(),
    supabase
      .from("produkty")
      .select("kategoria")
      .eq("dostepny", true)
      .not("kategoria", "is", null),
  ]);

  const produkty: Produkt[] = produktyRes.data ?? [];
  const totalCount = produktyRes.count ?? 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  const kategorieRaw = kategorieRes.data ?? [];
  const kategorie = [
    "",
    ...Array.from(new Set(kategorieRaw.map((r) => r.kategoria as string))).sort(),
  ];

  const headerText = szukaj
    ? totalCount === 0
      ? `Brak wyników dla „${szukaj}"`
      : `${totalCount} ${totalCount === 1 ? "wynik" : "wyników"} dla „${szukaj}"`
    : kategoria
    ? `${totalCount} produktów w kategorii ${kategoria.charAt(0) + kategoria.slice(1).toLowerCase()}`
    : `${totalCount} produktów w ofercie`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-[#0F172A] mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Katalog produktów
        </h1>
        <p className="text-[#64748B] text-sm">{headerText}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <KatalogFilters
            kategorie={kategorie}
            currentKategoria={kategoria}
            currentSzukaj={szukaj}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid produkty={produkty} szukaj={szukaj} kategoria={kategoria} />
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              kategoria={kategoria}
              szukaj={szukaj}
            />
          )}
        </div>
      </div>
    </div>
  );
}
