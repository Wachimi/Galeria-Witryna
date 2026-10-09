import { expect, test } from "@playwright/test";

test("profil artysty prowadzi do jego prac i filtrowanej kolekcji", async ({ page }) => {
  await page.goto("/artysci/piotr-fafrowicz");
  await expect(page.locator("h1")).toHaveText("Piotr Fąfrowicz");
  await expect(page.locator(".artist-biography")).toBeVisible();
  await expect(page.locator(".artist-profile-identity .artist-avatar-profile")).toBeVisible();
  const mail = page.getByRole("link", { name: "Zapytaj o prace artysty" });
  expect(decodeURIComponent((await mail.getAttribute("href"))!)).toContain(
    "Zapytanie o prace: Piotr Fąfrowicz",
  );
  await page.getByRole("link", { name: "Zobacz prace", exact: true }).click();
  await expect(page).toHaveURL(/#prace-artysty$/);
  const works = page.getByRole("region", { name: "Prace w galerii" });
  await expect(works).toBeVisible();
  // Kolejne kliknięcie wykonujemy po zakończeniu płynnego przewinięcia do sekcji.
  await expect
    .poll(async () => {
      const bounds = (await works.boundingBox())!;
      const padding = await page.evaluate(() =>
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
      );
      return Math.abs(bounds.y - padding);
    })
    .toBeLessThan(2);
  expect(await works.locator(".artwork-card").count()).toBeGreaterThan(0);
  await page.getByRole("link", { name: "Zobacz w kolekcji", exact: true }).click();
  await expect(page).toHaveURL(/\/kolekcja\?artist=piotr-fafrowicz$/);
  await expect(page.getByRole("combobox", { name: "Wybierz artystę" })).toHaveValue(
    "piotr-fafrowicz",
  );
  for (const author of await page.locator(".artwork-card-caption > p").all()) {
    await expect(author).toHaveText("Piotr Fąfrowicz");
  }
});

test("strona pracy pokazuje parametry, przygotowuje zapytanie i poleca inne prace autora", async ({
  page,
}) => {
  await page.goto("/kolekcja/wawoz-korzeniowy");
  await expect(page.locator("h1")).toHaveText("Wąwóz korzeniowy");
  await expect(page.locator(".artwork-specs")).toContainText("45 × 45 cm");
  await expect(page.locator(".artwork-description")).toBeVisible();
  await expect(page.locator(".artwork-status")).toBeVisible();
  const mail = await page
    .getByRole("link", { name: "Zapytaj o tę pracę", exact: true })
    .getAttribute("href");
  const decoded = decodeURIComponent(mail!);
  expect(decoded).toContain("mailto:galeriawitryna@wp.pl?");
  expect(decoded).toContain("Zapytanie o pracę: Wąwóz korzeniowy — Piotr Fąfrowicz");
  expect(decoded).toContain("Autor: Piotr Fąfrowicz\nTechnika: olej, płótno\nWymiary: 45 × 45 cm");
  await expect(page.locator(".artwork-phone")).toHaveAttribute("href", "tel:+48817503483");
  const related = page.getByRole("region", { name: "Więcej prac artysty" });
  await expect(related).toBeVisible();
  expect(await related.locator(".artwork-card").count()).toBeGreaterThan(0);
  await expect(related.getByRole("heading", { name: "Wąwóz korzeniowy", exact: true })).toHaveCount(
    0,
  );
  for (const author of await related.locator(".artwork-card-caption > p").all()) {
    await expect(author).toHaveText("Piotr Fąfrowicz");
  }
  await page.locator(".artwork-author").click();
  await expect(page).toHaveURL(/\/artysci\/piotr-fafrowicz$/);
});
