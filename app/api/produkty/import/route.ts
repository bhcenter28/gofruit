import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

async function requireAdmin() {
  const c = await cookies();
  return c.get("admin_session")?.value === "1";
}

type ImportRow = {
  nazwa: string;
  slug: string;
  kategoria?: string;
  opis?: string;
  jednostka?: string;
  indeks_erp?: string;
  dostepny: boolean;
};

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }

  const { rows }: { rows: ImportRow[] } = await req.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Brak danych do importu" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("produkty")
    .upsert(rows, { onConflict: "indeks_erp" })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ imported: data?.length ?? 0 });
}
