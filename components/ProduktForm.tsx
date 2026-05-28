"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produktSchema, type ProduktFormData } from "@/lib/validations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import type { Produkt } from "@/lib/supabase";

const kategorie = [
  "napoje", "slodycze", "przetwory", "nabial", "mrozonki", "chemia",
];

export function ProduktForm({ produkt }: { produkt?: Produkt }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "deleting">("idle");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProduktFormData>({
    resolver: zodResolver(produktSchema) as never,
    defaultValues: {
      nazwa: produkt?.nazwa ?? "",
      slug: produkt?.slug ?? "",
      opis: produkt?.opis ?? "",
      kategoria: produkt?.kategoria ?? "",
      podkategoria: produkt?.podkategoria ?? "",
      zdjecie_url: produkt?.zdjecie_url ?? "",
      jednostka: produkt?.jednostka ?? "",
      dostepny: produkt?.dostepny ?? true,
      indeks_erp: produkt?.indeks_erp ?? "",
    },
  });

  const nazwa = watch("nazwa");

  const autoSlug = () => {
    const slug = nazwa
      .toLowerCase()
      .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
      .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
      .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setValue("slug", slug);
  };

  const onSubmit = async (data: ProduktFormData) => {
    setStatus("saving");
    const url = produkt ? `/api/produkty/${produkt.id}` : "/api/produkty";
    const method = produkt ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/produkty");
    else setStatus("idle");
  };

  const onDelete = async () => {
    if (!produkt || !confirm("Na pewno usunąć ten produkt?")) return;
    setStatus("deleting");
    await fetch(`/api/produkty/${produkt.id}`, { method: "DELETE" });
    router.push("/admin/produkty");
  };

  const busy = status !== "idle";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nazwa">Nazwa *</Label>
          <Input
            id="nazwa"
            {...register("nazwa")}
            className="mt-1"
            onBlur={!produkt ? autoSlug : undefined}
          />
          {errors.nazwa && (
            <p className="text-xs text-red-500 mt-1">{errors.nazwa.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input id="slug" {...register("slug")} className="mt-1 font-mono text-sm" />
          {errors.slug && (
            <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="kategoria">Kategoria</Label>
          <select
            id="kategoria"
            {...register("kategoria")}
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1111] bg-white"
          >
            <option value="">— wybierz —</option>
            {kategorie.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="jednostka">Jednostka</Label>
          <Input id="jednostka" {...register("jednostka")} className="mt-1" placeholder="szt, kg, opak" />
        </div>
        <div>
          <Label htmlFor="indeks_erp">Indeks ERP</Label>
          <Input id="indeks_erp" {...register("indeks_erp")} className="mt-1 font-mono text-sm" />
        </div>
      </div>

      <div>
        <Label htmlFor="opis">Opis</Label>
        <Textarea id="opis" {...register("opis")} rows={4} className="mt-1 resize-none" />
      </div>

      <div>
        <Label htmlFor="zdjecie_url">URL zdjęcia</Label>
        <Input id="zdjecie_url" {...register("zdjecie_url")} className="mt-1" placeholder="https://..." />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="dostepny"
          type="checkbox"
          {...register("dostepny")}
          className="w-4 h-4 rounded border-gray-300 text-[#CC1111] cursor-pointer"
        />
        <Label htmlFor="dostepny" className="cursor-pointer">Produkt dostępny</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#CC1111] text-white font-semibold hover:bg-[#AA0000] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
        >
          {status === "saving" && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {status === "saving" ? "Zapisywanie..." : produkt ? "Zapisz zmiany" : "Dodaj produkt"}
        </button>
        {produkt && (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer text-sm font-medium"
          >
            {status === "deleting" && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            Usuń
          </button>
        )}
      </div>
    </form>
  );
}
