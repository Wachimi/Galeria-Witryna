import { expect, test } from "@playwright/test";

test("kolekcja porządkuje prace według artystów i odwraca kolejność sekcji", async ({ page }) => {
  await page.goto("/kolekcja");
  const groups = page.locator(".collection-artist-group");
  const headings = groups.locator("h2");
  await expect(headings.first()).toContainText("Marek Andała");
  const names = await headings.allTextContents();
  for (const group of await groups.all()) {
    const author = (await group.locator("h2").innerText()).replace(/\s+/g, " ");
    for (const caption of await group.locator(".artwork-card-caption > p").all()) {
      expect((await caption.innerText()).replace(/\s+/g, " ")).toBe(author);
    }
  }
  const authorOptions = await page
    .getByRole("combobox", { name: "Wybierz artystę" })
    .locator("option")
    .count();
  expect(authorOptions - 1).toBe(names.length);
  await page.getByRole("combobox", { name: "Sortuj prace według artystów" }).selectOption("desc");
  await expect(headings).toHaveText([...names].reverse());
  await expect(page).toHaveURL(/sort=desc/);
  await page.reload();
  await expect(headings).toHaveText([...names].reverse());
});

test("filtry można łączyć, odświeżyć, wyczyścić i zachować po powrocie z profilu", async ({
  page,
}) => {
  await page.goto("/kolekcja");
  const initialCount = await page.locator(".artwork-card").count();
  const artists = page.getByRole("combobox", { name: "Wybierz artystę" });
  const query = page.getByRole("searchbox", { name: "Szukaj pracy lub artysty" });
  await artists.selectOption("piotr-fafrowicz");
  await query.fill("wawoz FAFROWICZ");
  await expect(page.locator(".artwork-card")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Wąwóz korzeniowy", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/artist=piotr-fafrowicz/);
  await page.reload();
  await expect(artists).toHaveValue("piotr-fafrowicz");
  await expect(query).toHaveValue("wawoz FAFROWICZ");
  await expect(page.locator(".artwork-card")).toHaveCount(1);
  await page
    .locator(".collection-artist-heading")
    .getByRole("link", { name: "Poznaj artystę" })
    .click();
  await expect(page).toHaveURL(/\/artysci\/piotr-fafrowicz$/);
  await page.goBack();
  await expect(artists).toHaveValue("piotr-fafrowicz");
  await expect(query).toHaveValue("wawoz FAFROWICZ");
  await page.getByRole("button", { name: "Grafika", exact: true }).click();
  await expect(page.getByText("Brak prac pasujących do wybranych kryteriów.")).toBeVisible();
  await page.getByRole("button", { name: "Pokaż wszystkie prace" }).click();
  await expect(page.locator(".artwork-card")).toHaveCount(initialCount);
  await expect(page).toHaveURL(/\/kolekcja$/);
  await expect(query).toHaveValue("");
  await expect(artists).toHaveValue("");
});

test("link do nieobecnego autora pokazuje pusty wynik i pozwala wrócić do kolekcji", async ({
  page,
}) => {
  await page.goto("/kolekcja?artist=nieobecny-artysta&category=nieznana&sort=nieznane");
  await expect(page.getByRole("button", { name: "Wszystkie", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("combobox", { name: "Sortuj prace według artystów" })).toHaveValue(
    "asc",
  );
  await expect(page.locator(".artwork-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Wyczyść filtry" }).click();
  await expect(page.locator(".artwork-card").first()).toBeVisible();
  await expect(page).toHaveURL(/\/kolekcja$/);
});
