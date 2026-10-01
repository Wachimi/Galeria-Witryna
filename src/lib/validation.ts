import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(2, "Adres musi mieć co najmniej 2 znaki.")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Użyj małych liter bez polskich znaków, cyfr i pojedynczych myślników.",
  );
const status = z.enum(["draft", "published"]);

export const artistSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  name: z.string().trim().min(2, "Podaj imię i nazwisko artysty.").max(160),
  slug,
  biography: z.string().trim().min(10, "Opis powinien mieć co najmniej 10 znaków.").max(10000),
  status,
});

export const artworkSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  title: z.string().trim().min(1, "Podaj tytuł pracy.").max(200),
  slug,
  artist_id: z.uuid("Wybierz artystę."),
  category: z.enum(["malarstwo", "grafika", "rzezba"]),
  technique: z.string().trim().min(2, "Podaj technikę.").max(200),
  dimensions: z.string().trim().min(2, "Podaj wymiary.").max(100),
  year: z.preprocess(
    (value) => (value === "" || value === null ? null : Number(value)),
    z.number().int().min(1000).max(2100).nullable(),
  ),
  description: z.string().trim().min(10, "Opis powinien mieć co najmniej 10 znaków.").max(10000),
  image_alt: z.string().trim().min(5, "Opisz krótko, co przedstawia zdjęcie.").max(300),
  availability: z.enum(["unknown", "available", "reserved", "sold"]),
  status,
});

export const loginSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail.").max(254),
  password: z.string().min(1, "Podaj hasło.").max(256),
});

export type FormState = { error: string | null };
export const initialFormState: FormState = { error: null };
