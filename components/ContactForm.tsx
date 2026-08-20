"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kontaktSchema, type KontaktFormData } from "@/lib/validations";
import { useState } from "react";
import {
  CheckCircle, Loader2, Send, Phone, Mail, MapPin,
  Clock, ShieldCheck, ArrowRight, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contactDetails = [
  { Icon: Phone, value: "+48 000 000 000", sub: "Pn–Pt 7:00–17:00", href: "tel:+48000000000" },
  { Icon: Mail,  value: "biuro@gofruit.pl", sub: "Odpowiedź w 1 dzień roboczy", href: "mailto:biuro@gofruit.pl" },
  { Icon: MapPin, value: "ul. Przykładowa 1", sub: "70-000 Szczecin", href: null },
  { Icon: Clock,  value: "Pn–Pt 7:00–17:00", sub: "Sob 8:00–13:00", href: null },
];

const trustPoints = [
  { title: "Indywidualne warunki", desc: "Ofertę dopasowujemy do skali Twojego biznesu" },
  { title: "Odpowiedź w 24 h", desc: "Reagujemy szybko na każde zapytanie" },
  { title: "Ponad 20 lat na rynku", desc: "Setki zadowolonych partnerów handlowych" },
];

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">
        {label}{required && <span className="text-[#E23744] ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs text-[#DC2626]"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full h-12 px-4 rounded-none border border-[#E4E4E7] bg-white text-sm text-[#171717] " +
  "placeholder-[#A1A1AA] transition-all duration-150 outline-none " +
  "focus:border-[#E23744] focus:ring-3 focus:ring-[#E23744]/12 " +
  "aria-[invalid=true]:border-[#DC2626] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#DC2626]/12";

const textareaClass =
  "w-full px-4 py-3 rounded-none border border-[#E4E4E7] bg-white text-sm text-[#171717] " +
  "placeholder-[#A1A1AA] resize-none transition-all duration-150 outline-none " +
  "focus:border-[#E23744] focus:ring-3 focus:ring-[#E23744]/12 " +
  "aria-[invalid=true]:border-[#DC2626] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#DC2626]/12";

export function ContactForm({ produkt }: { produkt?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<KontaktFormData>({
    resolver: zodResolver(kontaktSchema),
    defaultValues: { produkt: produkt ?? "" },
  });

  const onSubmit = async (data: KontaktFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] rounded-none overflow-hidden border border-[#EAEAEC] bg-white shadow-[0_24px_60px_-30px_rgba(23,23,23,0.25)]">

      {/* ─── Lewa: formularz ─── */}
      <div className="bg-white px-8 py-10 sm:px-12 sm:py-12">
        <div className="mb-8">
          <span className="inline-block text-[11px] font-semibold text-[#E23744] uppercase tracking-widest mb-3">
            {produkt ? "Zapytanie o produkt" : "Zapytanie o ofertę"}
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#171717] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {produkt ? "Zapytaj o produkt" : "Otrzymaj wycenę dla swojej firmy"}
          </h2>
          {produkt ? (
            <p className="mt-2 text-sm text-[#71717A]">
              Produkt:{" "}
              <span className="font-semibold text-[#171717] bg-[#F6F6F7] px-2 py-0.5 rounded-none">
                {produkt}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#71717A]">
              Wypełnij formularz, a przygotujemy ofertę dopasowaną do Twojego asortymentu i skali.
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center py-14 text-center"
            >
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full bg-[#E23744] blur-2xl opacity-15 scale-150" />
                <div className="relative w-20 h-20 rounded-full bg-[#FCEBEC] border border-[#F6D2D5] flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-[#E23744]" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#171717] mb-1 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Zapytanie wysłane!
              </h3>
              <p className="text-[#71717A] text-sm mb-6">Odpiszemy w ciągu 1 dnia roboczego.</p>
              <button
                onClick={() => setStatus("idle")}
                className="text-sm font-semibold text-[#E23744] hover:text-[#C42130] transition-colors cursor-pointer"
              >
                Wyślij kolejne zapytanie
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field id="imie_nazwisko" label="Imię i nazwisko" required error={errors.imie_nazwisko?.message}>
                  <input
                    id="imie_nazwisko"
                    {...register("imie_nazwisko")}
                    autoComplete="name"
                    aria-invalid={!!errors.imie_nazwisko}
                    className={inputClass}
                    placeholder="Jan Kowalski"
                  />
                </Field>
                <Field id="firma" label="Firma" error={errors.firma?.message}>
                  <input
                    id="firma"
                    {...register("firma")}
                    autoComplete="organization"
                    className={inputClass}
                    placeholder="Nazwa firmy"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field id="telefon" label="Telefon" required error={errors.telefon?.message}>
                  <input
                    id="telefon"
                    type="tel"
                    {...register("telefon")}
                    autoComplete="tel"
                    aria-invalid={!!errors.telefon}
                    className={inputClass}
                    placeholder="+48 000 000 000"
                  />
                </Field>
                <Field id="email" label="Email" required error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={inputClass}
                    placeholder="jan@firma.pl"
                  />
                </Field>
              </div>

              {produkt && (
                <Field id="produkt" label="Produkt">
                  <input
                    id="produkt"
                    {...register("produkt")}
                    readOnly
                    className={`${inputClass} opacity-60 cursor-default`}
                  />
                </Field>
              )}

              <Field id="wiadomosc" label="Wiadomość" required error={errors.wiadomosc?.message}>
                <textarea
                  id="wiadomosc"
                  {...register("wiadomosc")}
                  rows={5}
                  aria-invalid={!!errors.wiadomosc}
                  className={textareaClass}
                  placeholder="Opisz, czego potrzebujesz: jakie produkty Cię interesują i w jakiej ilości…"
                />
              </Field>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-center gap-2.5 text-sm text-[#DC2626] bg-[#FEF2F2] border border-[#FCDCDC] rounded-none px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Coś poszło nie tak. Spróbuj ponownie lub zadzwoń do nas.
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="group w-full py-4 px-6 flex items-center justify-center gap-2.5 rounded-none bg-[#E23744] text-white font-semibold text-sm hover:bg-[#C42130] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="w-4 h-4" aria-hidden="true" />
                )}
                {status === "loading" ? "Wysyłanie…" : "Wyślij zapytanie"}
                {status !== "loading" && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#A1A1AA]">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Twoje dane są bezpieczne i nie będą udostępniane osobom trzecim.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Prawa: dane + trust ─── */}
      <div className="bg-[#171717] px-8 py-10 sm:px-9 sm:py-12 flex flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold text-[#E23744] uppercase tracking-widest mb-5">
            Dane kontaktowe
          </p>

          <div className="space-y-4">
            {contactDetails.map(({ Icon, value, sub, href }) => (
              <div key={value} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-none bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#E23744]" aria-hidden="true" />
                </div>
                <div>
                  {href ? (
                    <a href={href} className="text-sm font-semibold text-white hover:text-[#F6A8AF] transition-colors duration-150 cursor-pointer">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{value}</p>
                  )}
                  <p className="text-xs text-[#A1A1AA] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-7 border-t border-white/10">
          <p className="text-[11px] font-semibold text-[#71717A] uppercase tracking-widest mb-4">
            Dlaczego my?
          </p>
          <ul className="space-y-3.5">
            {trustPoints.map(({ title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-none bg-[#E23744]/15 border border-[#E23744]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#E23744]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{title}</p>
                  <p className="text-xs text-[#A1A1AA] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
