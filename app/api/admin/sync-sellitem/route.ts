import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  // Synchronizacja wymaga Playwright — działa tylko lokalnie
  return NextResponse.json({
    error: "Synchronizacja działa tylko lokalnie. Uruchom: node scripts/update-prices.mjs",
  }, { status: 400 });
}
