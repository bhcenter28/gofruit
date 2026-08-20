import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteInquiry } from "@/lib/inquiries";

async function requireAdmin() {
  const c = await cookies();
  return c.get("admin_session")?.value === "1";
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteInquiry(id);
  if (!ok) return NextResponse.json({ error: "Nie udało się usunąć" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
