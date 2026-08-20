import Image from "next/image";
import { IMAGES } from "@/lib/images";

const clients = [
  {
    image: IMAGES.retailShop,
    title: "Sklepy spożywcze",
    desc: "Od osiedlowego sklepu po sieci. Regularne, terminowe dostawy i szeroki asortyment.",
  },
  {
    image: IMAGES.gastronomy,
    title: "Gastronomia",
    desc: "Restauracje, bary i catering. Świeże produkty i pełna oferta prosto do kuchni.",
  },
  {
    image: IMAGES.retailAisle,
    title: "Stacje i convenience",
    desc: "Napoje, przekąski, nabiał i kompleksowe zaopatrzenie dopasowane do punktu.",
  },
];

export function ClientCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {clients.map(({ image, title, desc }) => (
        <article key={title} className="group relative overflow-hidden bg-[#171717]">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" aria-hidden="true" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3
              className="text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h3>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">{desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
