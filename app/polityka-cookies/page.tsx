import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Polityka cookies" };

export default function PolitykaCookies() {
  return (
    <LegalPage title="Polityka cookies" updated="sierpień 2026">
      <section>
        <h2>1. Czym są pliki cookies?</h2>
        <p>
          Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane na Twoim urządzeniu podczas
          odwiedzania stron internetowych. Umożliwiają prawidłowe działanie serwisu oraz jego
          personalizację.
        </p>
      </section>

      <section>
        <h2>2. Jakich cookies używamy</h2>
        <div className="mt-4 grid gap-3">
          <div className="border border-[#EAEAEC] bg-[#F6F6F7] p-5">
            <h3 className="font-bold text-[#171717] mb-1">Niezbędne (techniczne)</h3>
            <p className="text-sm text-[#71717A]">
              Konieczne do prawidłowego funkcjonowania serwisu. Bez nich strona nie będzie działać
              poprawnie. Nie można ich wyłączyć.
            </p>
          </div>
          <div className="border border-[#EAEAEC] bg-[#F6F6F7] p-5">
            <h3 className="font-bold text-[#171717] mb-1">Analityczne</h3>
            <p className="text-sm text-[#71717A]">
              Pomagają nam zrozumieć, jak użytkownicy korzystają z serwisu, na przykład które podstrony
              są najczęściej odwiedzane. Dane są anonimowe.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>3. Jak zarządzać cookies?</h2>
        <p>
          Możesz zarządzać plikami cookies poprzez ustawienia swojej przeglądarki. Wyłączenie cookies
          może wpłynąć na działanie niektórych funkcji serwisu.
        </p>
        <ul>
          <li>Chrome: Ustawienia, Prywatność, Pliki cookie</li>
          <li>Firefox: Opcje, Prywatność i bezpieczeństwo</li>
          <li>Safari: Preferencje, Prywatność</li>
        </ul>
      </section>

      <section>
        <h2>4. Podstawa prawna</h2>
        <p>
          Używanie niezbędnych plików cookies opiera się na naszym uzasadnionym interesie
          (art. 6 ust. 1 lit. f RODO) oraz wymogach technicznych. Korzystanie z serwisu oznacza
          akceptację niezbędnych plików cookies.
        </p>
      </section>

      <section>
        <h2>5. Kontakt</h2>
        <p>
          Pytania dotyczące polityki cookies kieruj na{" "}
          <a href="mailto:biuro@gofruit.pl">biuro@gofruit.pl</a>.
        </p>
      </section>
    </LegalPage>
  );
}
