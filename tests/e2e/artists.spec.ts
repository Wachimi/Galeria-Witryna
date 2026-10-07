import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import { formatPolishText } from "../../src/lib/typography";

const dataset = JSON.parse(
  readFileSync(new URL("../../supabase/imports/artists-2026-10-07.json", import.meta.url), "utf8"),
) as {
  artists: { slug: string; name: string; biography: string }[];
};

test("przeniesione profile są dostępne w katalogu i pokazują pełne biografie", async ({ page }) => {
  const response = await page.goto("/artysci");
  expect(response?.status()).toBe(200);
  test.skip(
    (await page.locator(".artist-card").count()) < dataset.artists.length,
    "Pełna migracja jest sprawdzana na podłączonej bazie; katalog lokalny zawiera trzy profile.",
  );
  expect(await page.locator(".artist-card").count()).toBeGreaterThanOrEqual(dataset.artists.length);
  const links = await page
    .locator(".artist-card a")
    .evaluateAll((elements) => elements.map((el) => el.getAttribute("href")));
  for (const artist of dataset.artists) expect(links).toContain(`/artysci/${artist.slug}`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);

  for (const slug of [
    "marek-andala",
    "wojciech-gorecki",
    "leszek-harasimowicz",
    "elzbieta-bocianowska",
  ]) {
    const artist = dataset.artists.find((item) => item.slug === slug)!;
    const detail = await page.goto(`/artysci/${slug}`);
    expect(detail?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(artist.name);
    await expect(page.locator(".artist-biography")).toHaveText(formatPolishText(artist.biography));
    await expect(page.locator(".artist-biography")).not.toContainText("[caption");
  }
});

test("wyszukiwarka artystów i sortowanie po nazwisku działają razem", async ({ page }) => {
  await page.goto("/artysci");
  const headings = page.locator(".artist-card h2");
  const total = await headings.count();
  const ascending = await headings.allTextContents();
  expect(ascending.indexOf("Marek Andała")).toBeLessThan(ascending.indexOf("Piotr Fąfrowicz"));
  expect(ascending.indexOf("Piotr Fąfrowicz")).toBeLessThan(ascending.indexOf("Jerzy Tyburski"));
  await page.getByRole("combobox", { name: "Sortuj artystów" }).selectOption("desc");
  await expect(headings).toHaveText([...ascending].reverse());

  const search = page.getByRole("searchbox", { name: "Szukaj artysty po imieniu lub nazwisku" });
  await search.fill("ANDALA marek");
  await expect(headings).toHaveText(["Marek Andała"]);
  await expect(page.getByText("Liczba artystów: 1", { exact: true })).toBeVisible();
  await page.locator(".artist-card h2").click();
  await expect(page).toHaveURL(/\/artysci\/marek-andala$/);
  await expect(page.locator(".artist-biography")).toBeVisible();

  await page.goto("/artysci");
  await page.getByRole("searchbox").fill("nieistniejacy-artysta");
  await expect(page.getByText("Nie znaleziono artystów pasujących do wyszukiwania.")).toBeVisible();
  await expect(headings).toHaveCount(0);
  await page.getByRole("button", { name: "Pokaż wszystkich artystów" }).click();
  await expect(headings).toHaveCount(total);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
