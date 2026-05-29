export const metadata = { title: "Polityka cookies — Fruit Hurtownia" };

export default function PolitykaCookies() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-[#0F172A] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
        Polityka cookies
      </h1>
      <p className="text-sm text-[#94A3B8] mb-10">Ostatnia aktualizacja: styczeń 2025</p>

      <div className="space-y-8 text-[#334155] text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">1. Czym są pliki cookies?</h2>
          <p>
            Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane na Twoim urządzeniu podczas
            odwiedzania stron internetowych. Umożliwiają prawidłowe działanie serwisu oraz jego
            personalizację.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">2. Jakich cookies używamy</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-100">
              <h3 className="font-bold text-[#0F172A] mb-1">Niezbędne (techniczne)</h3>
              <p className="text-xs text-[#64748B]">
                Konieczne do prawidłowego funkcjonowania serwisu. Bez nich strona nie będzie działać poprawnie.
                Nie można ich wyłączyć.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-100">
              <h3 className="font-bold text-[#0F172A] mb-1">Analityczne</h3>
              <p className="text-xs text-[#64748B]">
                Pomagają nam zrozumieć, jak użytkownicy korzystają z serwisu (np. które podstrony są
                najczęściej odwiedzane). Dane są anonimowe.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">3. Jak zarządzać cookies?</h2>
          <p>
            Możesz zarządzać plikami cookies poprzez ustawienia swojej przeglądarki. Wyłączenie cookies
            może wpłynąć na działanie niektórych funkcji serwisu.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1">
            <li>Chrome: Ustawienia → Prywatność → Pliki cookie</li>
            <li>Firefox: Opcje → Prywatność i bezpieczeństwo</li>
            <li>Safari: Preferencje → Prywatność</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">4. Podstawa prawna</h2>
          <p>
            Używanie niezbędnych plików cookies opiera się na naszym uzasadnionym interesie
            (art. 6 ust. 1 lit. f RODO) oraz wymogach technicznych. Korzystanie z serwisu oznacza
            akceptację niezbędnych plików cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">5. Kontakt</h2>
          <p>
            Pytania dotyczące polityki cookies kieruj na:{" "}
            <a href="mailto:biuro@gofruit.pl" className="text-[#CC1111] hover:underline">biuro@gofruit.pl</a>
          </p>
        </section>

      </div>
    </main>
  );
}
