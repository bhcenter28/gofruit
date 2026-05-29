export const metadata = { title: "Polityka prywatności — Fruit Hurtownia" };

export default function PolitykaPrywatnosci() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-[#0F172A] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
        Polityka prywatności
      </h1>
      <p className="text-sm text-[#94A3B8] mb-10">Ostatnia aktualizacja: styczeń 2025</p>

      <div className="prose prose-slate max-w-none space-y-8 text-[#334155] text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">1. Administrator danych osobowych</h2>
          <p>
            Administratorem Twoich danych osobowych jest <strong>Fruit Hurtownia Spożywcza</strong>,
            z siedzibą przy ul. Przykładowej 1, 70-000 Szczecin, NIP: 000-000-00-00
            (dalej: „Administrator").
          </p>
          <p className="mt-2">
            Kontakt z Administratorem: <a href="mailto:biuro@gofruit.pl" className="text-[#CC1111] hover:underline">biuro@gofruit.pl</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">2. Jakie dane zbieramy</h2>
          <p>W ramach działalności serwisu przetwarzamy następujące dane:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Imię i nazwisko</li>
            <li>Nazwa firmy</li>
            <li>Adres e-mail</li>
            <li>Numer telefonu</li>
            <li>Treść wiadomości przesłanych przez formularz kontaktowy</li>
            <li>Dane techniczne (adres IP, typ przeglądarki) — w celach statystycznych</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">3. Cel i podstawa prawna przetwarzania</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Obsługa zapytań</strong> — art. 6 ust. 1 lit. b RODO (realizacja umowy / działania przedumowne)</li>
            <li><strong>Marketing bezpośredni</strong> — art. 6 ust. 1 lit. f RODO (uzasadniony interes)</li>
            <li><strong>Obowiązki prawne</strong> — art. 6 ust. 1 lit. c RODO</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">4. Okres przechowywania danych</h2>
          <p>
            Dane przechowujemy przez okres niezbędny do realizacji celów, dla których zostały zebrane,
            nie dłużej niż przez 3 lata od ostatniego kontaktu lub do momentu wycofania zgody.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">5. Twoje prawa</h2>
          <p>Zgodnie z RODO przysługuje Ci prawo do:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Dostępu do swoich danych</li>
            <li>Sprostowania nieprawidłowych danych</li>
            <li>Usunięcia danych („prawo do bycia zapomnianym")</li>
            <li>Ograniczenia przetwarzania</li>
            <li>Przenoszenia danych</li>
            <li>Wniesienia sprzeciwu wobec przetwarzania</li>
            <li>Wniesienia skargi do Prezesa UODO (uodo.gov.pl)</li>
          </ul>
          <p className="mt-2">
            Aby skorzystać z powyższych praw, skontaktuj się z nami: <a href="mailto:biuro@gofruit.pl" className="text-[#CC1111] hover:underline">biuro@gofruit.pl</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">6. Odbiorcy danych</h2>
          <p>
            Twoje dane mogą być przekazywane podmiotom świadczącym usługi na nasze zlecenie
            (hosting, obsługa poczty e-mail), wyłącznie w zakresie niezbędnym do świadczenia tych usług.
            Nie sprzedajemy danych osobowych podmiotom trzecim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">7. Pliki cookies</h2>
          <p>
            Serwis używa plików cookies. Szczegółowe informacje znajdziesz w{" "}
            <a href="/polityka-cookies" className="text-[#CC1111] hover:underline">Polityce cookies</a>.
          </p>
        </section>

      </div>
    </main>
  );
}
