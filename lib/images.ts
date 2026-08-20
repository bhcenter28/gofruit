/**
 * Zdjęcia strony — placeholdery z Unsplash (darmowe).
 *
 * ➜ DO PODMIANY: gdy będziesz mieć własne zdjęcia (magazyn, produkty, dostawa),
 *   wgraj je do /public i podmień wartości np. na "/hero.jpg".
 *   Reszta strony nie wymaga zmian.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  heroWarehouse: u("1553413077-190dd305871c"), // korytarz magazynu, wysokie regały
  logistics:     u("1586528116311-ad8dd3c8310d"), // magazyn z paletami / pojemnikami
  produce:       u("1542838132-92c53300491e"),    // lada ze świeżymi warzywami
  retailShop:    u("1578916171728-46686eac8d58"), // jasna alejka marketu
  retailAisle:   u("1604719312566-8912e9227c6a"), // alejka sklepowa (produkty)
  freshFlatlay:  u("1490818387583-1baba5e638af"), // owoce na bieli (flatlay)
  gastronomy:    u("1447279506476-3faec8071eee"),  // gastronomia — świeży makaron
} as const;
