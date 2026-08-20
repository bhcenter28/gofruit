"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
      }}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#71717A] hover:text-[#E23744] transition-colors cursor-pointer"
    >
      <LogOut className="w-4 h-4" aria-hidden="true" />
      Wyloguj
    </button>
  );
}
