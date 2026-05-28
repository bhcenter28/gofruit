import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-[#CBD5E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Fruit"
                width={48}
                height={48}
                className="rounded-md"
              />
              <span
                className="text-white font-semibold text-lg"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Hurtownia
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              Hurtownia produktów spożywczych dla sklepów, restauracji i stacji benzynowych.
              Szybka dostawa, szeroki asortyment.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3
              className="text-white font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nawigacja
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Strona główna" },
                { href: "/katalog", label: "Katalog produktów" },
                { href: "/o-nas", label: "O nas" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-white font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#94A3B8]">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#CC1111]" aria-hidden="true" />
                <span>+48 000 000 000</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#94A3B8]">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#CC1111]" aria-hidden="true" />
                <a
                  href="mailto:biuro@fruit-hurtownia.pl"
                  className="hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  biuro@fruit-hurtownia.pl
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#94A3B8]">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#CC1111]" aria-hidden="true" />
                <span>ul. Przykładowa 1, 00-000 Miasto</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#64748B]">
          <p>&copy; {new Date().getFullYear()} Fruit Hurtownia. Wszelkie prawa zastrzeżone.</p>
          <p>Hurtownia produktów spożywczych</p>
        </div>
      </div>
    </footer>
  );
}
