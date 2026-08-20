import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Regulamin" };

export default function Regulamin() {
  return (
    <LegalPage title="Regulamin serwisu" updated="sierpień 2026">
      <section>
        <h2>§1 Postanowienia ogólne</h2>
        <p>
          Niniejszy regulamin określa zasady korzystania z serwisu internetowego{" "}
          <strong>gofruit.pl</strong> prowadzonego przez Fruit Hurtownię Spożywczą
          z siedzibą przy ul. Przykładowej 1, 70-000 Szczecin (dalej: „Operator").
        </p>
        <p>Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.</p>
      </section>

      <section>
        <h2>§2 Charakter serwisu</h2>
        <p>
          Serwis <strong>gofruit.pl</strong> jest wizytówką internetową hurtowni spożywczej
          skierowaną do podmiotów prowadzących działalność gospodarczą (B2B). Serwis ma charakter
          informacyjny i nie stanowi sklepu internetowego ani oferty handlowej w rozumieniu
          Kodeksu Cywilnego.
        </p>
        <p>Zamówienia realizowane są wyłącznie w oparciu o indywidualne ustalenia handlowe.</p>
      </section>

      <section>
        <h2>§3 Zakres usług</h2>
        <ul>
          <li>Prezentacja informacji o hurtowni i jej asortymencie</li>
          <li>Składanie zapytań ofertowych poprzez formularz kontaktowy</li>
        </ul>
      </section>

      <section>
        <h2>§4 Warunki techniczne</h2>
        <p>Do korzystania z serwisu wymagane jest:</p>
        <ul>
          <li>Urządzenie z dostępem do internetu</li>
          <li>Aktualna przeglądarka internetowa (Chrome, Firefox, Safari, Edge)</li>
          <li>Włączona obsługa JavaScript</li>
        </ul>
      </section>

      <section>
        <h2>§5 Własność intelektualna</h2>
        <p>
          Wszystkie treści zamieszczone w serwisie (teksty, grafiki, logo, zdjęcia) stanowią
          własność Operatora lub są używane za zgodą właścicieli. Kopiowanie, modyfikowanie lub
          rozpowszechnianie treści bez zgody Operatora jest zabronione.
        </p>
      </section>

      <section>
        <h2>§6 Ceny i oferty</h2>
        <p>
          Wiążące ceny oraz warunki współpracy ustalane są indywidualnie z przedstawicielem
          handlowym w odpowiedzi na zapytanie ofertowe. Informacje zawarte w serwisie nie stanowią
          oferty w rozumieniu przepisów prawa.
        </p>
      </section>

      <section>
        <h2>§7 Odpowiedzialność</h2>
        <p>
          Operator nie ponosi odpowiedzialności za czasową niedostępność serwisu wynikającą z prac
          technicznych lub awarii niezależnych od Operatora. Dokładamy wszelkich starań, aby serwis
          działał nieprzerwanie.
        </p>
      </section>

      <section>
        <h2>§8 Dane osobowe</h2>
        <p>
          Zasady przetwarzania danych osobowych opisuje{" "}
          <a href="/polityka-prywatnosci">Polityka prywatności</a>.
        </p>
      </section>

      <section>
        <h2>§9 Zmiany regulaminu</h2>
        <p>
          Operator zastrzega sobie prawo do zmiany regulaminu. O istotnych zmianach poinformujemy
          poprzez stosowny komunikat na stronie. Dalsze korzystanie z serwisu po zmianie regulaminu
          oznacza jego akceptację.
        </p>
      </section>

      <section>
        <h2>§10 Kontakt</h2>
        <p>
          W sprawach dotyczących regulaminu napisz na{" "}
          <a href="mailto:biuro@gofruit.pl">biuro@gofruit.pl</a>.
        </p>
      </section>
    </LegalPage>
  );
}
