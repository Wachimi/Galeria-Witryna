import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/env";
import { requireEditor } from "@/lib/auth";
import { logout } from "@/app/(auth)/logowanie/actions";

export const metadata: Metadata = {
  title: "Panel redakcyjny",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured())
    return (
      <main className="container centered-page">
        <div className="panel-config">
          <p className="eyebrow">PANEL REDAKCYJNY · KONFIGURACJA</p>
          <h1>Przygotowany do połączenia.</h1>
          <p>
            Strona działa z katalogiem startowym. Prawdziwe logowanie i zapis treści wymagają
            podłączenia Supabase.
          </p>
          <ol>
            <li>
              Utwórz projekt Supabase i uzupełnij <code>.env.local</code> zgodnie z{" "}
              <code>.env.example</code>.
            </li>
            <li>
              Uruchom migrację <code>supabase/migrations/001_initial_schema.sql</code> i opcjonalny{" "}
              <code>supabase/seed.sql</code>.
            </li>
            <li>Utwórz konto administratora, przypisz rolę i wyłącz publiczną rejestrację.</li>
            <li>
              Uruchom ponownie serwer. Szczegóły znajdziesz w <code>docs/02-supabase.md</code>.
            </li>
          </ol>
          <Link className="button button-dark" href="/">
            Wróć do galerii <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  const profile = await requireEditor();
  return (
    <div className="panel-shell">
      <aside className="panel-sidebar">
        <Link href="/" aria-label="Wróć do strony galerii">
          <Image src="/images/witryna-logo.png" alt="Witryna" width={168} height={33} />
        </Link>
        <nav aria-label="Menu panelu">
          <Link href="/panel">Przegląd</Link>
          <Link href="/panel/artysci">Artyści</Link>
          <Link href="/panel/prace">Prace</Link>
          {profile.role === "admin" && <Link href="/panel/uzytkownicy">Użytkownicy</Link>}
        </nav>
        <div className="panel-user">
          <div>
            {profile.display_name || "Zespół galerii"}
            <small>{profile.role === "admin" ? "Administrator" : "Redaktor"}</small>
          </div>
          <form action={logout}>
            <button type="submit">Wyloguj się</button>
          </form>
        </div>
      </aside>
      <main className="panel-content">
        <div className="panel-topbar">
          <span>PANEL REDAKCYJNY / WITRYNA</span>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Zobacz stronę ↗
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
