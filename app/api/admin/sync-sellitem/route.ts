import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  // Na Vercel nie ma Playwright — informuj użytkownika
  if (process.env.VERCEL) {
    return NextResponse.json({
      error: "Synchronizacja działa tylko lokalnie. Uruchom: node scripts/update-prices.mjs",
    }, { status: 400 });
  }

  const scriptPath = path.join(process.cwd(), "scripts", "update-prices.mjs");

  return new Promise<NextResponse>((resolve) => {
    const child = spawn("node", [scriptPath], {
      cwd: process.cwd(),
      env: { ...process.env },
      detached: false,
    });

    let output = "";
    let error = "";

    child.stdout.on("data", (d) => { output += d.toString(); });
    child.stderr.on("data", (d) => { error += d.toString(); });

    child.on("close", (code) => {
      if (code === 0) {
        const match = output.match(/Zaktualizowano (\d+) produktów/);
        const count = match ? match[1] : "?";
        resolve(NextResponse.json({ message: `✅ Zaktualizowano ${count} produktów w Supabase.` }));
      } else {
        resolve(NextResponse.json(
          { error: `Skrypt zakończył się błędem (kod ${code}): ${error.slice(0, 200)}` },
          { status: 500 }
        ));
      }
    });

    // Timeout 15 minut
    setTimeout(() => {
      child.kill();
      resolve(NextResponse.json({ error: "Timeout — synchronizacja trwała za długo." }, { status: 500 }));
    }, 15 * 60 * 1000);
  });
}
