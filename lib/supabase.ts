import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Produkt = {
  id: string;
  nazwa: string;
  slug: string;
  opis: string | null;
  kategoria: string | null;
  podkategoria: string | null;
  podpodgrupa: string | null;
  zdjecie_url: string | null;
  cena_netto: number | null;
  jednostka: string | null;
  dostepny: boolean;
  indeks_erp: string | null;
  znacznik: string | null;
  marka: string | null;
  kod_kreskowy: string | null;
  kod_pkwiu: string | null;
  rodzaj_koncesji: string | null;
  sklad: string | null;
  waga_netto: string | null;
  waga_brutto: string | null;
  data_waznosci_min: string | null;
  karton: number | null;
  blokada_sprzedazy: boolean | null;
  utworzono: string;
  zaktualizowano: string;
};
