import { test, expect } from "@playwright/test";

test("strona główna i podstrony publiczne działają", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/kolekcja",
    "/artysci",
    "/o-galerii",
    "/wystawy",
    "/kontakt",
    "/artysci/piotr-fafrowicz",
    "/kolekcja/tatary",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `Poziome przewijanie: ${path}`).toBe(false);
    const unboundWords = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const found: string[] = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, textarea, code, pre")) continue;
        if (!parent.getClientRects().length) continue;
        const text = node.textContent ?? "";
        if (/(?<![\p{L}\p{N}_])[aiouwz][ \t\r\n]+(?=\S)/iu.test(text)) found.push(text.trim());
      }
      return found;
    });
    expect(unboundWords, `Jednoliterowe słowa bez twardej spacji: ${path}`).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("kolekcja wyszukuje prace i pokazuje pusty wynik", async ({ page }) => {
  await page.goto("/kolekcja");
  await page.getByRole("searchbox", { name: "Szukaj pracy lub artysty" }).fill("Andała");
  await expect(page.getByText("Liczba prac: 1")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tatary", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Grafika", exact: true }).click();
  await expect(page.getByText("Brak prac pasujących do wybranych kryteriów.")).toBeVisible();
  await page.getByRole("button", { name: "Pokaż wszystkie prace" }).click();
  await expect(page.getByText("Liczba prac: 5")).toBeVisible();
});

test("bez konfiguracji nie udaje zalogowania ani dostępu do danych", async ({ page }) => {
  await page.goto("/logowanie");
  await expect(page.getByRole("button", { name: "Zaloguj się", exact: true })).toBeDisabled();
  await page.getByRole("link", { name: "Instrukcja uruchomienia panelu" }).click();
  await expect(page.getByRole("heading", { name: "Przygotowany do połączenia." })).toBeVisible();
});

test("nieznana praca zwraca stronę 404", async ({ page }) => {
  const response = await page.goto("/kolekcja/nieistniejaca-praca");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Tej strony tu nie ma." })).toBeVisible();
});

test("logo prowadzi na samą górę strony głównej", async ({ page }) => {
  for (const path of ["/kolekcja", "/artysci", "/kontakt", "/", "/#wybrane-prace", "/#top"]) {
    await page.goto(path);
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await page.getByRole("link", { name: "Galeria Witryna — strona główna", exact: true }).click();
    await expect(page).toHaveURL(new URL("/", test.info().project.use.baseURL).href);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  }
});

test("menu mobilne otwiera się i zamyka po przejściu", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Otwórz menu" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "Zamknij menu" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page
    .getByRole("navigation", { name: "Menu główne" })
    .getByRole("link", { name: "Kontakt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await expect(page.getByRole("button", { name: "Otwórz menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
