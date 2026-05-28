import { z } from "zod";

export const kontaktSchema = z.object({
  imie_nazwisko: z.string().min(2, "Imię i nazwisko jest wymagane"),
  firma: z.string().optional(),
  telefon: z.string().min(9, "Podaj prawidłowy numer telefonu"),
  email: z.string().email("Podaj prawidłowy adres email"),
  wiadomosc: z.string().min(10, "Wiadomość musi mieć co najmniej 10 znaków"),
  produkt: z.string().optional(),
});

export type KontaktFormData = z.infer<typeof kontaktSchema>;

export const produktSchema = z.object({
  nazwa: z.string().min(1, "Nazwa jest wymagana"),
  slug: z.string().min(1, "Slug jest wymagany"),
  opis: z.string().optional(),
  kategoria: z.string().optional(),
  podkategoria: z.string().optional(),
  zdjecie_url: z.string().url().optional().or(z.literal("")),
  jednostka: z.string().optional(),
  dostepny: z.boolean(),
  indeks_erp: z.string().optional(),
});

export type ProduktFormData = z.infer<typeof produktSchema>;
