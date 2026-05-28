"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/produkty");
    } else {
      setError("Nieprawidłowe hasło");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center">
            <Package className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
        </div>
        <h1
          className="text-2xl font-bold text-center text-[#0F172A] mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Panel admina
        </h1>
        <p className="text-center text-[#64748B] text-sm mb-8">Fruit Hurtownia</p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="mb-4">
            <Label htmlFor="password" className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              Hasło
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 mb-3" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#CC1111] text-white font-semibold hover:bg-[#AA0000] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
