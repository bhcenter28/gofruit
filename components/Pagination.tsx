"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  kategoria?: string;
  szukaj?: string;
}

function buildHref(p: number, kategoria?: string, szukaj?: string) {
  const params = new URLSearchParams();
  if (kategoria) params.set("kategoria", kategoria);
  if (szukaj) params.set("szukaj", szukaj);
  if (p > 1) params.set("strona", String(p));
  const qs = params.toString();
  return `/katalog${qs ? `?${qs}` : ""}`;
}

function getPageNumbers(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (page > 3) pages.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
  if (page < totalPages - 2) pages.push("…");
  pages.push(totalPages);
  return pages;
}

export function Pagination({ page, totalPages, kategoria, szukaj }: Props) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="text-xs text-[#94A3B8]">
        Strona <span className="font-semibold text-[#475569]">{page}</span> z{" "}
        <span className="font-semibold text-[#475569]">{totalPages}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Paginacja">
        <Link
          href={buildHref(page - 1, kategoria, szukaj)}
          aria-disabled={page <= 1}
          aria-label="Poprzednia strona"
          className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-150
            ${page <= 1
              ? "border-gray-100 text-gray-300 pointer-events-none"
              : "border-gray-200 text-[#334155] hover:border-[#CC1111]/50 hover:text-[#CC1111] hover:bg-[#FFF1F1] cursor-pointer"
            }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`dots-${i}`}
              className="w-11 h-11 flex items-center justify-center text-sm text-[#94A3B8]"
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p, kategoria, szukaj)}
              aria-label={`Strona ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all duration-150
                ${p === page
                  ? "bg-[#CC1111] border-[#CC1111] text-white shadow-sm shadow-[#CC1111]/30"
                  : "border-gray-200 text-[#334155] hover:border-[#CC1111]/50 hover:text-[#CC1111] hover:bg-[#FFF1F1] cursor-pointer"
                }`}
            >
              {p}
            </Link>
          )
        )}

        <Link
          href={buildHref(page + 1, kategoria, szukaj)}
          aria-disabled={page >= totalPages}
          aria-label="Następna strona"
          className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-150
            ${page >= totalPages
              ? "border-gray-100 text-gray-300 pointer-events-none"
              : "border-gray-200 text-[#334155] hover:border-[#CC1111]/50 hover:text-[#CC1111] hover:bg-[#FFF1F1] cursor-pointer"
            }`}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </nav>
    </div>
  );
}
