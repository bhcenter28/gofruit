import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

// Jedna rodzina do nagłówków i tekstu (charakter zbliżony do "Unity" z coca-cola.com,
// ale w pełni darmowa i legalna). Latin-ext = polskie znaki diakrytyczne.
const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const BASE_URL = "https://gofruit.pl";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Fruit – Hurtownia Produktów Spożywczych | Szczecin",
    template: "%s | Fruit Hurtownia",
  },
  description:
    "Hurtownia spożywcza Fruit – ponad 10 000 produktów dla sklepów, restauracji i stacji benzynowych. Szczecin i cała Polska. Szybka dostawa, konkurencyjne ceny, sprawdzona jakość od 2003 r.",
  keywords: [
    "hurtownia spożywcza", "hurtownia spożywcza Szczecin", "hurt spożywczy",
    "produkty spożywcze hurtownia", "napoje hurtownia", "słodycze hurtownia",
    "hurtownia dla sklepów", "hurtownia dla restauracji", "dostawa spożywcza",
    "Fruit hurtownia", "gofruit", "zakupy hurtowe spożywcze",
  ],
  authors: [{ name: "Fruit Hurtownia Spożywcza", url: BASE_URL }],
  creator: "Fruit Hurtownia Spożywcza",
  publisher: "Fruit Hurtownia Spożywcza",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: BASE_URL,
    siteName: "Fruit Hurtownia Spożywcza",
    title: "Fruit – Hurtownia Produktów Spożywczych | Szczecin",
    description:
      "Ponad 10 000 produktów spożywczych dla sklepów, restauracji i stacji benzynowych. Szybka dostawa w całej Polsce.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Fruit Hurtownia Spożywcza" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fruit – Hurtownia Produktów Spożywczych",
    description: "Ponad 10 000 produktów spożywczych. Szybka dostawa w całej Polsce.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "", // uzupełnij po weryfikacji w Search Console
  },
  category: "food wholesale",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Fruit Hurtownia Spożywcza",
      legalName: "FRUIT Mariusz Grzybowski, Henryk Grzybowski Spółka Jawna",
      taxID: "8522380980",
      vatID: "PL8522380980",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+48 731 025 736",
        contactType: "sales",
        areaServed: "PL",
        availableLanguage: "Polish",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "al. Wojska Polskiego 191/6",
        addressLocality: "Szczecin",
        postalCode: "71-325",
        addressCountry: "PL",
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Fruit Hurtownia Spożywcza",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/katalog?szukaj={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${hanken.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
