export const metadata = { title: "Regulamin — Fruit Hurtownia" };

export default function Regulamin() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-[#0F172A] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
        Regulamin serwisu
      </h1>
      <p className="text-sm text-[#94A3B8] mb-10">Ostatnia aktualizacja: styczeń 2025</p>

      <div className="space-y-8 text-[#334155] text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§1 Postanowienia ogólne</h2>
          <p>
            Niniejszy regulamin określa zasady korzystania z serwisu internetowego{" "}
            <strong>gofruit.pl</strong> prowadzonego przez Fruit Hurtownię Spożywczą
            z siedzibą przy ul. Przykładowej 1, 70-000 Szczecin (dalej: „Operator").
          </p>
          <p className="mt-2">
            Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§2 Charakter serwisu</h2>
          <p>
            Serwis <strong>gofruit.pl</strong> jest katalogiem produktów hurtowni spożywczej
            skierowanym do podmiotów prowadzących działalność gospodarczą (B2B).
            Serwis ma charakter informacyjny — nie stanowi sklepu internetowego ani oferty handlowej
            w rozumieniu Kodeksu Cywilnego.
          </p>
          <p className="mt-2">
            Zamówienia realizowane są wyłącznie w oparciu o indywidualne ustalenia handlowe.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§3 Zakres usług</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Przeglądanie katalogu produktów</li>
            <li>Wyszukiwanie produktów według nazwy, kategorii lub kodu EAN</li>
            <li>Składanie zapytań ofertowych poprzez formularz kontaktowy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§4 Warunki techniczne</h2>
          <p>Do korzystania z serwisu wymagane jest:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Urządzenie z dostępem do internetu</li>
            <li>Aktualna przeglądarka internetowa (Chrome, Firefox, Safari, Edge)</li>
            <li>Włączona obsługa JavaScript</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§5 Własność intelektualna</h2>
          <p>
            Wszystkie treści zamieszczone w serwisie (teksty, grafiki, logo, zdjęcia produktów)
            stanowią własność Operatora lub są używane za zgodą właścicieli. Kopiowanie,
            modyfikowanie lub rozpowszechnianie treści bez zgody Operatora jest zabronione.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§6 Ceny</h2>
          <p>
            Ceny produktów prezentowane w katalogu mają charakter orientacyjny i mogą ulec zmianie.
            Wiążące ceny ustalane są indywidualnie z przedstawicielem handlowym.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§7 Odpowiedzialność</h2>
          <p>
            Operator nie ponosi odpowiedzialności za czasową niedostępność serwisu wynikającą
            z prac technicznych lub awarii niezależnych od Operatora. Dołożymy wszelkich starań,
            aby serwis działał nieprzerwanie.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§8 Dane osobowe</h2>
          <p>
            Zasady przetwarzania danych osobowych opisuje{" "}
            <a href="/polityka-prywatnosci" className="text-[#CC1111] hover:underline">Polityka prywatności</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§9 Zmiany regulaminu</h2>
          <p>
            Operator zastrzega sobie prawo do zmiany regulaminu. O istotnych zmianach poinformujemy
            poprzez stosowny komunikat na stronie. Dalsze korzystanie z serwisu po zmianie regulaminu
            oznacza jego akceptację.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">§10 Kontakt</h2>
          <p>
            W sprawach dotyczących regulaminu skontaktuj się:{" "}
            <a href="mailto:biuro@gofruit.pl" className="text-[#CC1111] hover:underline">biuro@gofruit.pl</a>
          </p>
        </section>

      </div>
    </main>
  );
}
