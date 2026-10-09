import { expect, test } from "@playwright/test";

test("zdjęcia na kartach prowadzą do szczegółów pracy bez otwierania podglądu", async ({
  page,
  context,
}) => {
  for (const path of ["/", "/kolekcja", "/artysci/marek-andala", "/kolekcja/wawoz-korzeniowy"]) {
    await page.goto(path);
    const card = page.locator(".artwork-card").first();
    await expect(card.getByRole("button")).toHaveCount(0);
    const image = card.getByRole("link", { name: /^Zobacz szczegóły pracy:/ });
    const href = (await image.getAttribute("href"))!;
    await image.click();
    await expect(page).toHaveURL(new URL(href, test.info().project.use.baseURL).href);
    await expect(page.locator(".artwork-detail")).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Podgląd pracy" })).not.toBeVisible();
    expect(context.pages()).toHaveLength(1);
  }
});

test("duży podgląd jest dostępny na podstronie pracy i obsługuje klawiaturę", async ({
  page,
  context,
}) => {
  for (const path of ["/kolekcja/tatary", "/kolekcja/wawoz-korzeniowy"]) {
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
    await page.keyboard.press("Shift+Tab");
    await expect(
      preview.getByRole("button", { name: "Przybliż obraz", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(preview.getByRole("button", { name: "Dopasuj obraz do ekranu" })).toBeFocused();
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

test("podgląd przybliża obraz, przesuwa detale i przywraca pełny kadr", async ({ page }) => {
  await page.goto("/kolekcja/tatary");
  const trigger = page.getByRole("button", { name: "Powiększ pracę: Tatary" });
  await trigger.click();
  const preview = page.getByRole("dialog", { name: "Podgląd pracy" });
  const image = preview.getByRole("img");
  await image.evaluate((image: HTMLImageElement) => image.decode());
  const fit = preview.getByRole("button", { name: "Dopasuj obraz do ekranu" });
  const zoomIn = preview.getByRole("button", { name: "Przybliż obraz", exact: true });
  const zoomOut = preview.getByRole("button", { name: "Oddal obraz", exact: true });
  await expect(fit).toHaveText("100%");
  await expect(zoomOut).toBeDisabled();
  await zoomIn.click();
  await zoomIn.click();
  await expect(fit).toHaveText("200%");
  const stage = preview.locator(".zoomable-preview-stage");
  const bounds = (await stage.boundingBox())!;
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 80, center.y, { steps: 5 });
  await page.mouse.up();
  await expect
    .poll(() => image.evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).m41))
    .toBeGreaterThan(20);
  await expect(preview).toBeVisible();
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 5000, center.y, { steps: 5 });
  await page.mouse.up();
  const pan = await image.evaluate((img) => ({
    x: new DOMMatrix(getComputedStyle(img).transform).m41,
    limit: Math.max(0, (img.clientWidth * 2 - img.parentElement!.clientWidth) / 2),
  }));
  expect(Math.abs(pan.x)).toBeLessThanOrEqual(pan.limit + 1);
  await fit.click();
  await expect(fit).toHaveText("100%");
  await expect
    .poll(() => image.evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).m41))
    .toBe(0);
  for (let index = 0; index < 6; index++) await zoomIn.click();
  await expect(fit).toHaveText("400%");
  await expect(zoomIn).toBeDisabled();
  await zoomOut.click();
  await expect(fit).toHaveText("350%");
  await stage.hover({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
  await page.mouse.wheel(0, 150);
  await expect
    .poll(() => image.evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).a))
    .toBeLessThan(3.5);
  await page.mouse.wheel(0, -200);
  await expect
    .poll(() => image.evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).a))
    .toBeGreaterThan(3);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await expect(fit).toHaveText("100%");
  await expect(zoomOut).toBeDisabled();
  await image.dblclick();
  await expect(fit).toHaveText("200%");
  await image.dblclick();
  await expect(fit).toHaveText("100%");
});

test("na telefonie dwa palce przybliżają obraz, a jeden przesuwa detale", async ({
  page,
  context,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/kolekcja/tatary");
  await page.getByRole("button", { name: "Powiększ pracę: Tatary" }).click();
  const preview = page.getByRole("dialog", { name: "Podgląd pracy" });
  const image = preview.getByRole("img");
  await image.evaluate((image: HTMLImageElement) => image.decode());
  const stage = (await preview.locator(".zoomable-preview-stage").boundingBox())!;
  const x = stage.x + stage.width / 2;
  const y = stage.y + stage.height / 2;
  const cdp = await context.newCDPSession(page);
  try {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { id: 1, x: x - 40, y },
        { id: 2, x: x + 40, y },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { id: 1, x: x - 80, y },
        { id: 2, x: x + 80, y },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect
      .poll(() => image.evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).a))
      .toBeGreaterThan(1.8);
    const previousX = await image.evaluate(
      (img) => new DOMMatrix(getComputedStyle(img).transform).m41,
    );
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ id: 1, x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ id: 1, x: x + 50, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect
      .poll(() => image.evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).m41))
      .toBeGreaterThan(previousX + 20);
    await expect(preview).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  } finally {
    await cdp.detach();
  }
});

test("najechanie przybliża zdjęcie, a podpis nadal prowadzi do szczegółów", async ({
  page,
}, testInfo) => {
  await page.goto("/kolekcja");
  const card = page
    .locator(".artwork-card")
    .filter({ has: page.getByRole("heading", { name: "Tatary", exact: true }) });
  const trigger = card.getByRole("link", { name: "Zobacz szczegóły pracy: Tatary" });
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
  await card.locator(".artwork-card-caption").click();
  await expect(page).toHaveURL(/\/kolekcja\/tatary$/);
  await expect(page.locator("h1")).toHaveText("Tatary");
});
