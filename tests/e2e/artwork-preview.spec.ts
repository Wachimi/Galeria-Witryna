import { expect, test } from "@playwright/test";

test("zdjęcia prac otwierają duży podgląd na stronie głównej, w kolekcji i u artysty", async ({
  page,
  context,
}) => {
  for (const path of ["/", "/kolekcja", "/artysci/marek-andala", "/kolekcja/tatary"]) {
    await page.goto(path);
    const trigger = page.getByRole("button", { name: /^Powiększ pracę:/ }).first();
    await trigger.locator("img").evaluate((image: HTMLImageElement) => image.decode());
    const address = page.url();
    await trigger.click();
    const preview = page.getByRole("dialog", { name: "Podgląd pracy" });
    await expect(preview).toBeVisible();
    await expect(page).toHaveURL(address);
    expect(context.pages()).toHaveLength(1);
    const close = preview.getByRole("button", { name: "Zamknij podgląd" });
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(close).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    const image = preview.getByRole("img");
    await image.evaluate((image: HTMLImageElement) => image.decode());
    const dimensions = await image.evaluate((image: HTMLImageElement) => {
      const bounds = image.getBoundingClientRect();
      const stage = image.parentElement!.getBoundingClientRect();
      return {
        ratio: bounds.width / bounds.height,
        naturalRatio: image.naturalWidth / image.naturalHeight,
        inside:
          bounds.top >= stage.top - 1 &&
          bounds.bottom <= stage.bottom + 1 &&
          bounds.left >= stage.left - 1 &&
          bounds.right <= stage.right + 1,
      };
    });
    expect(dimensions.ratio).toBeCloseTo(dimensions.naturalRatio, 2);
    expect(dimensions.inside).toBe(true);
    await image.click();
    await expect(preview).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(preview).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
    await trigger.click();
    await close.click();
    await expect(preview).not.toBeVisible();
    await trigger.click();
    await preview.click({ position: { x: 4, y: 80 } });
    await expect(preview).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
});

test("najechanie przybliża zdjęcie, a podpis nadal prowadzi do szczegółów", async ({
  page,
}, testInfo) => {
  await page.goto("/kolekcja");
  const card = page
    .locator(".artwork-card")
    .filter({ has: page.getByRole("heading", { name: "Tatary", exact: true }) });
  const trigger = card.getByRole("button", { name: "Powiększ pracę: Tatary" });
  if (testInfo.project.name === "desktop") {
    await trigger.hover();
    await expect
      .poll(() =>
        trigger
          .locator("img")
          .evaluate((image) => new DOMMatrix(getComputedStyle(image).transform).a),
      )
      .toBeCloseTo(1.075, 2);
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(
      await trigger.locator("img").evaluate((image) => getComputedStyle(image).transitionDuration),
    ).toBe("0s");
  }
  await card.getByRole("link", { name: /Zobacz szczegóły/ }).click();
  await expect(page).toHaveURL(/\/kolekcja\/tatary$/);
  await expect(page.locator("h1")).toHaveText("Tatary");
});
