import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas",
  description: "Fruit Hurtownia Spożywcza – ponad 20 lat na rynku. Poznaj naszą historię i wartości. Dostarczamy dla sklepów, restauracji i stacji benzynowych w całej Polsce.",
  alternates: { canonical: "https://gofruit.pl/o-nas" },
};

export default function ONasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
