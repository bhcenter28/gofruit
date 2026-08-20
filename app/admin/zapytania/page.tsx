import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { listInquiries, storageReady } from "@/lib/inquiries";
import { ZapytaniaList } from "@/components/admin/ZapytaniaList";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Zapytania — panel" };

export default async function AdminZapytania() {
  const c = await cookies();
  if (c.get("admin_session")?.value !== "1") redirect("/admin");

  const zapytania = await listInquiries();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E23744] mb-2">Panel</p>
          <h1 className="text-3xl font-extrabold text-[#171717] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Zapytania ofertowe <span className="text-[#A1A1AA] font-semibold">({zapytania.length})</span>
          </h1>
        </div>
        <LogoutButton />
      </div>

      {!storageReady && (
        <div className="mb-6 flex items-start gap-3 border border-[#F5C6C9] bg-[#FCEBEC] p-4 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#C42130]" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#171717]">Magazyn zapytań nie jest podłączony.</p>
            <p className="mt-1 text-[#71717A]">
              Utwórz bazę w Vercel → Storage (Upstash Redis / KV) i wykonaj redeploy, aby zgłoszenia
              z formularza były tu zapisywane.
            </p>
          </div>
        </div>
      )}

      <ZapytaniaList initial={zapytania} />
    </div>
  );
}
