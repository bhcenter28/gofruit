import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#52525B] hover:text-[#171717] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Strona główna
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-[#E23744]" aria-hidden="true" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E23744]">Dokumenty</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-[-0.02em] leading-[1.05]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#A1A1AA]">Ostatnia aktualizacja: {updated}</p>

        <div
          className="mt-10 space-y-8 text-[15px] text-[#52525B] leading-relaxed
            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#171717] [&_h2]:mb-3 [&_h2]:tracking-tight
            [&_p]:mt-2 [&_a]:text-[#E23744] [&_a]:font-medium hover:[&_a]:underline
            [&_strong]:text-[#171717] [&_strong]:font-semibold
            [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
