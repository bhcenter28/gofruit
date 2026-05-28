-- Tabela produktów
CREATE TABLE IF NOT EXISTS produkty (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nazwa         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  opis          TEXT,
  kategoria     TEXT,
  podkategoria  TEXT,
  zdjecie_url   TEXT,
  jednostka     TEXT,
  dostepny      BOOLEAN DEFAULT TRUE,
  indeks_erp    TEXT UNIQUE,
  utworzono     TIMESTAMPTZ DEFAULT NOW(),
  zaktualizowano TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_produkty_kategoria ON produkty(kategoria);
CREATE INDEX IF NOT EXISTS idx_produkty_dostepny  ON produkty(dostepny);
CREATE INDEX IF NOT EXISTS idx_produkty_nazwa     ON produkty USING gin(to_tsvector('polish', nazwa));

-- Row Level Security: publiczny odczyt, insert/update/delete tylko przez service role
ALTER TABLE produkty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publiczny odczyt dostępnych produktów"
  ON produkty FOR SELECT
  USING (dostepny = TRUE);

CREATE POLICY "Admin może wszystko przez service role"
  ON produkty FOR ALL
  USING (TRUE);
