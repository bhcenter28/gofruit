import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { produktSchema } from "@/lib/validations";
import { cookies } from "next/headers";

function requireAdmin() {
  return cookies().then((c) => c.get("admin_session")?.value === "1");
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = produktSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase.from("produkty").insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
