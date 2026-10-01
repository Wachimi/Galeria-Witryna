import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Profile } from "@/types/catalog";

export const getCurrentProfile = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const result = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", data.user.id)
    .single<Profile>();
  if (result.error) throw new Error("Nie udało się odczytać uprawnień konta.");
  return result.data;
});

export async function requireEditor() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/logowanie");
  if (profile.role !== "admin" && profile.role !== "editor") redirect("/logowanie?error=access");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireEditor();
  if (profile.role !== "admin") redirect("/panel");
  return profile;
}
