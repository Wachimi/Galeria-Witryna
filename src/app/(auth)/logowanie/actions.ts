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
  if (error)
    return {
      error: "Nie udało się zalogować. Sprawdź adres e-mail i hasło lub spróbuj ponownie później.",
    };
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
