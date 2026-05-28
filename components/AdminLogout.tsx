"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogout() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 cursor-pointer"
    >
      <LogOut className="w-4 h-4" aria-hidden="true" />
      Wyloguj
    </button>
  );
}
