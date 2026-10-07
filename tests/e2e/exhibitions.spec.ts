import { expect, test } from "@playwright/test";

test("archiwum udostępnia siedem wystaw i wszystkie zdjęcia", async ({ page }) => {
  await page.goto("/wystawy");
  const cards = page.locator(".exhibition-card-link");
  await expect(cards).toHaveCount(7);
  const paths = await cards.evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  const photoPaths = new Set<string>();
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const photos = page.locator(".exhibition-gallery img");
    await expect(photos).toHaveCount(2);
    for (const photo of await photos.all()) {
      await photo.scrollIntoViewIfNeeded();
      await photo.evaluate((image: HTMLImageElement) => image.decode());
      await photo.locator("..").click();
      const preview = page.getByRole("dialog", { name: "Podgląd zdjęć wystawy" });
      await expect(preview).toBeVisible();
      const src = (await preview.getByRole("img").getAttribute("src"))!;
      photoPaths.add(src);
      expect(src).toMatch(/^\/images\/exhibitions\/.*\.webp$/);
      expect((await page.request.get(src)).status()).toBe(200);
      await preview.getByRole("button", { name: "Zamknij podgląd" }).click();
      await expect(preview).not.toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await page.getByRole("link", { name: "Wróć do wszystkich wystaw" }).click();
    await expect(page).toHaveURL(/\/wystawy$/);
  }
  expect(photoPaths.size).toBe(14);
});

test("podgląd obsługuje przyciski, klawiaturę i zamykanie bez nowych kart", async ({
  page,
  context,
}, testInfo) => {
  await page.goto("/wystawy/bartlomiej-michalowski-wpadnij-na-50-tke");
  const trigger = page.getByRole("button", { name: /^Powiększ zdjęcie 1:/ });
  await trigger.click();
  const preview = page.getByRole("dialog", { name: "Podgląd zdjęć wystawy" });
  await expect(preview).toBeVisible();
  await expect(preview.getByRole("button", { name: "Zamknij podgląd" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(preview.getByRole("button", { name: "Następne zdjęcie" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(preview.getByRole("button", { name: "Zamknij podgląd" })).toBeFocused();
  await expect(preview.getByRole("img")).toHaveAttribute("src", /michalowski-1\.webp$/);
  await preview.getByRole("img").evaluate((image: HTMLImageElement) => image.decode());
  await preview.screenshot({ path: testInfo.outputPath("podglad.png") });
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await preview.getByRole("button", { name: "Następne zdjęcie" }).click();
  await expect(preview.getByRole("img")).toHaveAttribute("src", /michalowski-2\.webp$/);
  await page.keyboard.press("ArrowRight");
  await expect(preview.getByRole("img")).toHaveAttribute("src", /michalowski-1\.webp$/);
  await page.keyboard.press("ArrowLeft");
  await expect(preview.getByRole("img")).toHaveAttribute("src", /michalowski-2\.webp$/);
  await preview.getByRole("button", { name: "Poprzednie zdjęcie" }).click();
  await expect(preview.getByRole("img")).toHaveAttribute("src", /michalowski-1\.webp$/);
  await page.keyboard.press("Escape");
  await expect(preview).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await expect(preview).toBeVisible();
  await preview.click({ position: { x: 4, y: 80 } });
  await expect(preview).not.toBeVisible();
  expect(context.pages()).toHaveLength(1);
});

test("nieznana wystawa zwraca 404", async ({ page }) => {
  const response = await page.goto("/wystawy/nieistniejaca-wystawa");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Tej strony tu nie ma." })).toBeVisible();
});
