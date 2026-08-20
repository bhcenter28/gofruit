import { NextRequest, NextResponse } from "next/server";
import { kontaktSchema } from "@/lib/validations";
import { saveInquiry } from "@/lib/inquiries";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = kontaktSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  const { imie_nazwisko, firma, telefon, email, wiadomosc, produkt } = parsed.data;

  const stored = await saveInquiry({ imie_nazwisko, firma, telefon, email, wiadomosc, produkt });

  if (!stored) {
    // Baza (Vercel KV / Upstash) nie jest jeszcze podpięta — zgłoszenie nie zostało zapisane.
    console.warn("Brak skonfigurowanego magazynu zapytań (KV) — zgłoszenie nie zapisane.");
  }

  return NextResponse.json({ ok: true });
}
