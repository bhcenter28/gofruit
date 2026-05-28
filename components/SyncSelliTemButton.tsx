"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function SyncSelliTemButton() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSync() {
    if (status === "running") return;
    setStatus("running");
    setMsg("Synchronizacja uruchomiona... (może potrwać 5-10 min)");
    try {
      const res = await fetch("/api/admin/sync-sellitem", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
        setMsg(data.message || "Synchronizacja zakończona.");
      } else {
        setStatus("error");
        setMsg(data.error || "Błąd synchronizacji.");
      }
    } catch {
      setStatus("error");
      setMsg("Błąd połączenia z serwerem.");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleSync}
        disabled={status === "running"}
        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border transition-colors duration-200 cursor-pointer ${
          status === "running"
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-[#334155] border-gray-200 hover:border-[#CC1111] hover:text-[#CC1111]"
        }`}
      >
        <RefreshCw className={`w-4 h-4 ${status === "running" ? "animate-spin" : ""}`} aria-hidden="true" />
        {status === "running" ? "Synchronizacja..." : "Sync ceny z selliTem"}
      </button>
      {msg && (
        <p className={`text-xs ${status === "error" ? "text-red-500" : status === "done" ? "text-green-600" : "text-[#64748B]"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
