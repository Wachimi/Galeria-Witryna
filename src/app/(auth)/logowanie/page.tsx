import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { isSupabaseConfigured } from "@/lib/env";
import { getCurrentProfile } from "@/lib/auth";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Logowanie", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const configured = isSupabaseConfigured();
  const profile = await getCurrentProfile();
  if (profile?.role === "admin" || profile?.role === "editor") redirect("/panel");
  return (
    <main className="auth-page">
      <div className="auth-brand-panel">
        <Link href="/" aria-label="Galeria Witryna — strona główna">
          <Image src="/images/witryna-logo.png" alt="Witryna" width={218} height={43} />
        </Link>
        <div>
          <p className="eyebrow">PRZESTRZEŃ DLA REDAKCJI</p>
          <h1>
            Twórz opowieść
            <br />
            <em>naszej galerii.</em>
          </h1>
          <p>Zarządzaj artystami i&nbsp;pracami. Dziel się sztuką z&nbsp;odwiedzającymi Witrynę.</p>
        </div>
        <Link href="/" className="text-link">
          Wróć do strony galerii <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <p className="eyebrow">PANEL REDAKCYJNY</p>
          <h2>Dobrze Cię widzieć.</h2>
          <p>Zaloguj się na konto nadane przez administratora galerii.</p>
          {profile ? (
            <>
              <p className="notice error" role="alert">
                Twoje konto nie ma jeszcze uprawnień redaktora. Skontaktuj się
                z&nbsp;administratorem galerii.
              </p>
              <form action={logout}>
                <button className="button button-outline" type="submit">
                  Wyloguj się
                </button>
              </form>
            </>
          ) : (
            <LoginForm configured={configured} />
          )}
          <p className="auth-help">
            Dostęp przeznaczony dla zespołu galerii. Jeśli nie pamiętasz hasła, skontaktuj się
            z&nbsp;administratorem.
          </p>
          {!configured && (
            <Link className="text-link" href="/panel">
              Instrukcja uruchomienia panelu <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
