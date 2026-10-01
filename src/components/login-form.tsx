"use client";

import { useActionState } from "react";
import { ArrowUpRight } from "lucide-react";
import { login } from "@/app/(auth)/logowanie/actions";
import { initialFormState } from "@/lib/validation";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, initialFormState);
  return (
    <form action={action} className="auth-form">
      {!configured && (
        <p className="notice">
          Logowanie uruchomimy po podłączeniu Supabase. Instrukcja konfiguracji znajduje się w
          README projektu.
        </p>
      )}
      {state.error && (
        <p className="notice error" role="alert">
          {state.error}
        </p>
      )}
      <label className="form-field">
        Adres e-mail
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          disabled={!configured}
          placeholder="twoj@email.pl"
        />
      </label>
      <label className="form-field">
        Hasło
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
          disabled={!configured}
        />
      </label>
      <button className="button button-dark" type="submit" disabled={!configured || pending}>
        {pending ? "Logowanie…" : "Zaloguj się"}
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
