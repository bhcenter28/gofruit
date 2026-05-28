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
  { Icon: MapPin, value: "ul. Przykładowa 1", sub: "00-000 Miasto", href: null },
  { Icon: Clock,  value: "Pn–Pt 7:00–17:00", sub: "Sob 8:00–13:00", href: null },
];

const trustPoints = [
  { title: "Indywidualne warunki", desc: "Oferta dopasowana do skali Twojego biznesu" },
  { title: "Odpowiedź w 24h", desc: "Reagujemy błyskawicznie na każde zapytanie" },
  { title: "Ponad 10 lat na rynku", desc: "Setki zadowolonych partnerów handlowych" },
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
      <label htmlFor={id} className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
        {label}{required && <span className="text-[#CC1111] ml-0.5">*</span>}
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
            className="flex items-center gap-1.5 text-xs text-red-500"
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
  "w-full h-12 px-4 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm text-[#0F172A] " +
  "placeholder-[#94A3B8] transition-all duration-150 outline-none " +
  "focus:border-[#CC1111] focus:bg-white focus:ring-3 focus:ring-[#CC1111]/10 " +
  "aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-100 aria-[invalid=true]:ring-2";

const textareaClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm text-[#0F172A] " +
  "placeholder-[#94A3B8] resize-none transition-all duration-150 outline-none " +
  "focus:border-[#CC1111] focus:bg-white focus:ring-3 focus:ring-[#CC1111]/10 " +
  "aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-100 aria-[invalid=true]:ring-2";

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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] rounded-3xl overflow-hidden shadow-2xl shadow-black/10">

      {/* ─── Lewa: formularz ─── */}
      <div className="bg-white px-8 py-10 sm:px-12 sm:py-12">
        <div className="mb-8">
          <span className="inline-block text-[10px] font-black text-[#CC1111] uppercase tracking-[0.15em] mb-3">
            Formularz kontaktowy
          </span>
          <h1
            className="text-3xl font-black text-[#0F172A] leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {produkt ? `Zapytaj o produkt` : `Napisz do nas`}
          </h1>
          {produkt && (
            <p className="mt-1.5 text-sm text-[#64748B]">
              Produkt:{" "}
              <span className="font-semibold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                {produkt}
              </span>
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
                <div className="absolute inset-0 rounded-full bg-green-400 blur-2xl opacity-25 scale-150" />
                <div className="relative w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" aria-hidden="true" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-[#0F172A] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                Wiadomość wysłana!
              </h2>
              <p className="text-[#64748B] text-sm mb-6">Odpiszemy w ciągu 1 dnia roboczego.</p>
              <button
                onClick={() => setStatus("idle")}
                className="text-sm font-semibold text-[#CC1111] hover:text-[#AA0000] transition-colors cursor-pointer"
              >
                Wyślij kolejną wiadomość
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
                  placeholder="Opisz czego potrzebujesz — jakie produkty Cię interesują, jakiej ilości szukasz..."
                />
              </Field>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-center gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Coś poszło nie tak. Spróbuj ponownie lub zadzwoń do nas.
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="group w-full h-13 flex items-center justify-center gap-2.5 rounded-xl bg-[#CC1111] text-white font-bold text-sm hover:bg-[#AA0000] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-lg shadow-[#CC1111]/25 hover:shadow-xl hover:shadow-[#CC1111]/30"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="w-4 h-4" aria-hidden="true" />
                )}
                {status === "loading" ? "Wysyłanie…" : "Wyślij wiadomość"}
                {status !== "loading" && (
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[10px] text-[#94A3B8]">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Twoje dane są bezpieczne i nie będą udostępniane osobom trzecim.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Prawa: dane + trust ─── */}
      <div className="bg-[#0F172A] px-8 py-10 sm:px-10 sm:py-12 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black text-[#CC1111] uppercase tracking-[0.15em] mb-5">
            Dane kontaktowe
          </p>

          <div className="space-y-4">
            {contactDetails.map(({ Icon, value, sub, href }) => (
              <div key={value} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#CC1111]" aria-hidden="true" />
                </div>
                <div>
                  {href ? (
                    <a href={href} className="text-sm font-semibold text-white hover:text-[#FCA5A5] transition-colors duration-150 cursor-pointer">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{value}</p>
                  )}
                  <p className="text-xs text-[#94A3B8] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-7 border-t border-white/10">
          <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.15em] mb-4">
            Dlaczego my?
          </p>
          <ul className="space-y-3.5">
            {trustPoints.map(({ title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#CC1111]/15 border border-[#CC1111]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#CC1111]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{title}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
