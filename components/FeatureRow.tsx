import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

interface FeatureRowProps {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  desc: string;
  bullets?: string[];
  cta?: { href: string; label: string };
  imageRight?: boolean;
  id?: string;
}

export function FeatureRow({
  image, alt, eyebrow, title, desc, bullets, cta, imageRight = false, id,
}: FeatureRowProps) {
  return (
    <section id={id} className={id ? "scroll-mt-16" : undefined}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Obraz */}
          <div className={imageRight ? "lg:order-2" : ""}>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6F6F7]">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Tekst */}
          <div className={imageRight ? "lg:order-1" : ""}>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#E23744]" aria-hidden="true" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#E23744]">
                {eyebrow}
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#171717] tracking-[-0.02em] leading-[1.05]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h2>
            <p className="mt-5 text-lg text-[#52525B] leading-relaxed max-w-lg">{desc}</p>

            {bullets && (
              <ul className="mt-6 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px] text-[#3F3F46]">
                    <Check className="w-5 h-5 text-[#E23744] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {cta && (
              <Link
                href={cta.href}
                className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-[#171717] border-b-2 border-[#E23744] pb-1 hover:gap-3 transition-all duration-200"
              >
                {cta.label}
                <ArrowRight className="w-4 h-4 text-[#E23744]" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
