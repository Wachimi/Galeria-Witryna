import assert from "node:assert/strict";
import { test } from "node:test";
import { formatPolishText } from "../src/lib/typography.ts";

test("łączy jednoliterowe słowa, także kolejne i pisane wielką literą", () => {
  assert.equal(
    formatPolishText("A i z Witryny w Lublinie o sztuce u artystów. I obrazy."),
    "A\u00a0i\u00a0z\u00a0Witryny w\u00a0Lublinie o\u00a0sztuce u\u00a0artystów. I\u00a0obrazy.",
  );
  assert.equal(
    formatPolishText("„W galerii” oraz (z pasją)."),
    "„W\u00a0galerii” oraz (z\u00a0pasją).",
  );
});

test("zachowuje dłuższe słowa, podział akapitów i istniejące twarde spacje", () => {
  const text = "Obrazy oraz grafiki\n\nArtyści z\u00a0Lublina. Łodzi i Polski.";
  const result = "Obrazy oraz grafiki\n\nArtyści z\u00a0Lublina. Łodzi i\u00a0Polski.";
  assert.equal(formatPolishText(text), result);
  assert.equal(formatPolishText(result), result);
  assert.equal(formatPolishText(undefined), "");
  assert.equal(formatPolishText("Galeria w\n Lublinie"), "Galeria w\u00a0Lublinie");
  assert.equal(formatPolishText("Kończy się i\n\nNowy akapit."), "Kończy się i\n\nNowy akapit.");
});
