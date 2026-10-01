"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type FormState } from "@/lib/validation";

export async function login(_previousState: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured())
    return { error: "Logowanie będzie dostępne po podłączeniu bazy Supabase." };
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    console.error(
      "Błąd logowania Supabase",
      JSON.stringify({ code: error.code, name: error.name, status: error.status }),
    );
    if (error.code === "email_not_confirmed")
      return {
        error: "Adres e-mail nie został potwierdzony. Potwierdź adres przed zalogowaniem.",
      };
    if (error.code === "invalid_credentials")
      return { error: "Nieprawidłowy adres e-mail lub hasło." };
    if (error.status === 429)
      return { error: "Zbyt wiele prób logowania. Odczekaj kilka minut i spróbuj ponownie." };
    if (error.name === "AuthRetryableFetchError")
      return {
        error: "Nie udało się połączyć z usługą logowania. Spróbuj ponownie za chwilę.",
      };
    return {
      error: "Usługa logowania zwróciła błąd. Spróbuj ponownie później.",
    };
  }
  redirect("/panel");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("Nie udało się wylogować. Spróbuj ponownie.");
  }
  redirect("/logowanie");
}
