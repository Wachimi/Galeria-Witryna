import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { MAX_PORTRAIT_BYTES, optimizePortrait } from "../src/lib/portrait-upload.ts";

test("portret ma prawidłową orientację, mały rozmiar i nie zawiera EXIF", async () => {
  const input = await sharp({
    create: { width: 1200, height: 800, channels: 3, background: "#708c56" },
  })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toBuffer();
  const output = await optimizePortrait(
    new File([new Uint8Array(input)], "portret.jpg", { type: "image/jpeg" }),
  );
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.format, "jpeg");
  assert.equal(metadata.height, 640);
  assert.ok(metadata.width! < metadata.height!);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.orientation, undefined);
  assert.ok(output.length < MAX_PORTRAIT_BYTES);
});

test("odrzuca nieczytelne pliki, SVG udające PNG i zbyt duże fotografie", async () => {
  await assert.rejects(
    optimizePortrait(new File(["nie jest zdjęciem"], "portret.png", { type: "image/png" })),
    /Nie udało się odczytać/,
  );
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100"/></svg>';
  await assert.rejects(
    optimizePortrait(new File([svg], "portret.png", { type: "image/png" })),
    /Nie udało się odczytać/,
  );
  await assert.rejects(
    optimizePortrait(new File([svg], "portret.svg", { type: "image/svg+xml" })),
    /Wybierz zdjęcie/,
  );
  await assert.rejects(
    optimizePortrait(
      new File([new Uint8Array(MAX_PORTRAIT_BYTES + 1)], "za-duze.jpg", { type: "image/jpeg" }),
    ),
    /maksymalnie 5 MB/,
  );
});
