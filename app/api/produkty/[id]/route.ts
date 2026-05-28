import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { produktSchema } from "@/lib/validations";
import { cookies } from "next/headers";

async function requireAdmin() {
  const c = await cookies();
  return c.get("admin_session")?.value === "1";
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = produktSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("produkty")
    .update({ ...parsed.data, zaktualizowano: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase.from("produkty").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
