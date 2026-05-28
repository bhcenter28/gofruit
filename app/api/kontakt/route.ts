import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { kontaktSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = kontaktSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  const { imie_nazwisko, firma, telefon, email, wiadomosc, produkt } = parsed.data;

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — email not sent");
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "Formularz Fruit <formularz@fruit-hurtownia.pl>",
    to: [process.env.CONTACT_EMAIL ?? "biuro@fruit-hurtownia.pl"],
    replyTo: email,
    subject: `Nowe zapytanie od ${imie_nazwisko}${produkt ? ` — ${produkt}` : ""}`,
    html: `
      <h2>Nowe zapytanie z formularza</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px;color:#64748B;width:130px">Imię i nazwisko:</td><td style="padding:8px;font-weight:600">${imie_nazwisko}</td></tr>
        ${firma ? `<tr><td style="padding:8px;color:#64748B">Firma:</td><td style="padding:8px">${firma}</td></tr>` : ""}
        <tr><td style="padding:8px;color:#64748B">Telefon:</td><td style="padding:8px">${telefon}</td></tr>
        <tr><td style="padding:8px;color:#64748B">Email:</td><td style="padding:8px">${email}</td></tr>
        ${produkt ? `<tr><td style="padding:8px;color:#64748B">Produkt:</td><td style="padding:8px">${produkt}</td></tr>` : ""}
        <tr><td style="padding:8px;color:#64748B;vertical-align:top">Wiadomość:</td><td style="padding:8px">${wiadomosc.replace(/\n/g, "<br>")}</td></tr>
      </table>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Błąd wysyłania emaila" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
