import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, FileText, Shield, Cookie } from "lucide-react";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-[#CBD5E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* ── Główna siatka ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Fruit" width={44} height={44} className="rounded-lg" />
              <div>
                <p className="text-white font-bold text-base leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                  Fruit
                </p>
                <p className="text-[#475569] text-xs mt-0.5">Hurtownia Spożywcza</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#64748B] mb-4">
              Hurtownia produktów spożywczych dla sklepów, restauracji i stacji benzynowych.
              Szybka dostawa, szeroki asortyment, uczciwe ceny.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-[#475569]">
              <span>NIP: 000-000-00-00</span>
              <span>REGON: 000000000</span>
            </div>
          </div>

          {/* Nawigacja */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              Nawigacja
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/",        label: "Strona główna" },
                { href: "/katalog", label: "Katalog produktów" },
                { href: "/o-nas",   label: "O nas" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#64748B] hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#64748B]">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#CC1111]" aria-hidden="true" />
                <a href="tel:+48000000000" className="hover:text-white transition-colors">+48 000 000 000</a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#64748B]">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#CC1111]" aria-hidden="true" />
                <a href="mailto:biuro@gofruit.pl" className="hover:text-white transition-colors break-all">
                  biuro@gofruit.pl
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#64748B]">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#CC1111]" aria-hidden="true" />
                <span>ul. Przykładowa 1<br />70-000 Szczecin</span>
              </li>
            </ul>
          </div>

          {/* Dokumenty prawne */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              Dokumenty
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/regulamin" className="flex items-center gap-2 text-sm text-[#64748B] hover:text-white transition-colors duration-200">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="flex items-center gap-2 text-sm text-[#64748B] hover:text-white transition-colors duration-200">
                  <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="/polityka-cookies" className="flex items-center gap-2 text-sm text-[#64748B] hover:text-white transition-colors duration-200">
                  <Cookie className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Polityka cookies
                </Link>
              </li>
            </ul>
            <div className="mt-5 p-3 rounded-xl bg-[#CC1111]/8 border border-[#CC1111]/15">
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Administrator danych osobowych zgodnie z RODO:<br />
                <span className="text-white/60">Fruit Hurtownia Spożywcza</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Pasek dolny ── */}
        <div className="pt-6 border-t border-[#1E293B]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#475569]">
            <p>&copy; {year} Fruit Hurtownia Spożywcza. Wszelkie prawa zastrzeżone.</p>
            <div className="flex items-center gap-4">
              <Link href="/regulamin" className="hover:text-[#94A3B8] transition-colors">Regulamin</Link>
              <Link href="/polityka-prywatnosci" className="hover:text-[#94A3B8] transition-colors">Prywatność</Link>
              <Link href="/polityka-cookies" className="hover:text-[#94A3B8] transition-colors">Cookies</Link>
            </div>
          </div>
          <p className="text-center text-[10px] text-[#334155] mt-3">
            Strona używa plików cookies niezbędnych do jej funkcjonowania. Korzystając z serwisu, wyrażasz zgodę na ich użycie.
          </p>
        </div>

      </div>
    </footer>
  );
}
