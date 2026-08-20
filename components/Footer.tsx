import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, FileText, Shield, Cookie } from "lucide-react";

const year = new Date().getFullYear();

const navLinks = [
  { href: "/",         label: "Strona główna" },
  { href: "/#o-nas",   label: "O nas" },
  { href: "/#oferta",  label: "Oferta" },
  { href: "/#kontakt", label: "Zapytaj o ofertę" },
];

const legalLinks = [
  { href: "/regulamin",             label: "Regulamin",            Icon: FileText },
  { href: "/polityka-prywatnosci",  label: "Polityka prywatności", Icon: Shield },
  { href: "/polityka-cookies",      label: "Polityka cookies",     Icon: Cookie },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#EAEAEC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Fruit — hurtownia spożywcza" width={44} height={44} className="rounded-none" />
              <div className="leading-none">
                <p className="text-[#171717] font-bold text-base" style={{ fontFamily: "var(--font-heading)" }}>
                  Fruit
                </p>
                <p className="text-[#A1A1AA] text-xs mt-0.5">Hurtownia spożywcza</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#71717A] mb-4 max-w-xs">
              Hurtownia produktów spożywczych dla sklepów, gastronomii i stacji paliw.
              Szeroki asortyment, uczciwe ceny, dostawa na czas.
            </p>
            <div className="flex flex-col gap-1 text-xs text-[#A1A1AA]">
              <span>NIP: 000-000-00-00</span>
              <span>REGON: 000000000</span>
            </div>
          </div>

          {/* Nawigacja */}
          <div>
            <h2 className="text-[#171717] font-semibold mb-4 text-xs uppercase tracking-widest">
              Nawigacja
            </h2>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#71717A] hover:text-[#E23744] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h2 className="text-[#171717] font-semibold mb-4 text-xs uppercase tracking-widest">
              Kontakt
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#71717A]">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#E23744]" aria-hidden="true" />
                <a href="tel:+48000000000" className="hover:text-[#171717] transition-colors">+48 000 000 000</a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#71717A]">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#E23744]" aria-hidden="true" />
                <a href="mailto:biuro@gofruit.pl" className="hover:text-[#171717] transition-colors break-all">
                  biuro@gofruit.pl
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-[#71717A]">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#E23744]" aria-hidden="true" />
                <span>ul. Przykładowa 1<br />70-000 Szczecin</span>
              </li>
            </ul>
          </div>

          {/* Dokumenty */}
          <div>
            <h2 className="text-[#171717] font-semibold mb-4 text-xs uppercase tracking-widest">
              Dokumenty
            </h2>
            <ul className="space-y-2.5">
              {legalLinks.map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-sm text-[#71717A] hover:text-[#171717] transition-colors duration-200">
                    <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 rounded-none bg-[#F6F6F7] border border-[#EAEAEC]">
              <p className="text-xs text-[#71717A] leading-relaxed">
                Administrator danych zgodnie z RODO:<br />
                <span className="text-[#171717] font-medium">Fruit Hurtownia Spożywcza</span>
              </p>
            </div>
          </div>
        </div>

        {/* Pasek dolny */}
        <div className="pt-6 border-t border-[#EAEAEC]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#A1A1AA]">
            <p>&copy; {year} Fruit Hurtownia Spożywcza. Wszelkie prawa zastrzeżone.</p>
            <div className="flex items-center gap-4">
              <Link href="/regulamin" className="hover:text-[#171717] transition-colors">Regulamin</Link>
              <Link href="/polityka-prywatnosci" className="hover:text-[#171717] transition-colors">Prywatność</Link>
              <Link href="/polityka-cookies" className="hover:text-[#171717] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
