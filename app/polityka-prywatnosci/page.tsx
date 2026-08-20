import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Polityka prywatności" };

export default function PolitykaPrywatnosci() {
  return (
    <LegalPage title="Polityka prywatności" updated="sierpień 2026">
      <section>
        <h2>1. Administrator danych osobowych</h2>
        <p>
          Administratorem Twoich danych osobowych jest <strong>Fruit Hurtownia Spożywcza</strong>,
          z siedzibą przy ul. Przykładowej 1, 70-000 Szczecin, NIP: 852-238-09-80
          (dalej: „Administrator").
        </p>
        <p>
          Kontakt z Administratorem: <a href="mailto:biuro@gofruit.pl">biuro@gofruit.pl</a>.
        </p>
      </section>

      <section>
        <h2>2. Jakie dane zbieramy</h2>
        <p>W ramach działalności serwisu przetwarzamy następujące dane:</p>
        <ul>
          <li>Imię i nazwisko</li>
          <li>Nazwa firmy</li>
          <li>Adres e-mail</li>
          <li>Numer telefonu</li>
          <li>Treść wiadomości przesłanych przez formularz kontaktowy</li>
          <li>Dane techniczne (adres IP, typ przeglądarki) w celach statystycznych</li>
        </ul>
      </section>

      <section>
        <h2>3. Cel i podstawa prawna przetwarzania</h2>
        <ul>
          <li><strong>Obsługa zapytań</strong>: art. 6 ust. 1 lit. b RODO (realizacja umowy lub działania przedumowne)</li>
          <li><strong>Marketing bezpośredni</strong>: art. 6 ust. 1 lit. f RODO (uzasadniony interes)</li>
          <li><strong>Obowiązki prawne</strong>: art. 6 ust. 1 lit. c RODO</li>
        </ul>
      </section>

      <section>
        <h2>4. Okres przechowywania danych</h2>
        <p>
          Dane przechowujemy przez okres niezbędny do realizacji celów, dla których zostały zebrane,
          nie dłużej niż przez 3 lata od ostatniego kontaktu lub do momentu wycofania zgody.
        </p>
      </section>

      <section>
        <h2>5. Twoje prawa</h2>
        <p>Zgodnie z RODO przysługuje Ci prawo do:</p>
        <ul>
          <li>Dostępu do swoich danych</li>
          <li>Sprostowania nieprawidłowych danych</li>
          <li>Usunięcia danych („prawo do bycia zapomnianym")</li>
          <li>Ograniczenia przetwarzania</li>
          <li>Przenoszenia danych</li>
          <li>Wniesienia sprzeciwu wobec przetwarzania</li>
          <li>Wniesienia skargi do Prezesa UODO (uodo.gov.pl)</li>
        </ul>
        <p>
          Aby skorzystać z powyższych praw, skontaktuj się z nami:{" "}
          <a href="mailto:biuro@gofruit.pl">biuro@gofruit.pl</a>.
        </p>
      </section>

      <section>
        <h2>6. Odbiorcy danych</h2>
        <p>
          Twoje dane mogą być przekazywane podmiotom świadczącym usługi na nasze zlecenie (hosting,
          obsługa poczty e-mail), wyłącznie w zakresie niezbędnym do świadczenia tych usług. Nie
          sprzedajemy danych osobowych podmiotom trzecim.
        </p>
      </section>

      <section>
        <h2>7. Pliki cookies</h2>
        <p>
          Serwis używa plików cookies. Szczegółowe informacje znajdziesz w{" "}
          <a href="/polityka-cookies">Polityce cookies</a>.
        </p>
      </section>
    </LegalPage>
  );
}
