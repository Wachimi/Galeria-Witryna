import assert from "node:assert/strict";
import test from "node:test";
import { selectWeeklyArtworks } from "../src/lib/weekly-artworks.ts";

const artworks = Array.from({ length: 6 }, (_, index) => ({
  id: String(index + 1),
  status: "published" as const,
}));
const ids = (now: string, items = artworks) =>
  selectWeeklyArtworks(items, new Date(now)).map((artwork) => artwork.id);

test("utrzymuje zestaw przez cały tydzień i zmienia go w poniedziałek o północy w Polsce", () => {
  assert.deepEqual(ids("2026-10-04T22:00:00Z"), ["1", "2", "3"]);
  assert.deepEqual(ids("2026-10-09T12:00:00Z"), ["1", "2", "3"]);
  assert.deepEqual(ids("2026-10-11T21:59:59.999Z"), ["1", "2", "3"]);
  assert.deepEqual(ids("2026-10-11T22:00:00Z"), ["4", "5", "6"]);
});

test("uwzględnia czas zimowy, zmianę czasu i przełom roku", () => {
  for (const [sunday, monday] of [
    ["2026-01-04T22:59:59.999Z", "2026-01-04T23:00:00Z"],
    ["2026-03-29T21:59:59.999Z", "2026-03-29T22:00:00Z"],
    ["2026-10-25T22:59:59.999Z", "2026-10-25T23:00:00Z"],
    ["2027-01-03T22:59:59.999Z", "2027-01-03T23:00:00Z"],
  ]) {
    assert.notDeepEqual(ids(sunday), ids(monday));
    assert.deepEqual(ids(monday), ids(new Date(Date.parse(monday) + 24 * 3600000).toISOString()));
  }
  assert.deepEqual(ids("2026-12-31T12:00:00Z"), ids("2027-01-01T12:00:00Z"));
});

test("kolejność wejściowa nie zmienia wyboru, a funkcja nie modyfikuje kolekcji", () => {
  const reversed = [...artworks].reverse();
  const snapshot = [...reversed];
  assert.deepEqual(ids("2026-10-09T12:00:00Z", reversed), ids("2026-10-09T12:00:00Z"));
  assert.deepEqual(reversed, snapshot);
});

test("pomija szkice i bez powtórzeń pokazuje tyle opublikowanych prac, ile jest dostępnych", () => {
  assert.deepEqual(selectWeeklyArtworks([]), []);
  for (let count = 1; count <= 3; count++) {
    const published = artworks.slice(0, count);
    const items = [...published, { id: "draft", status: "draft" as const }];
    assert.deepEqual(selectWeeklyArtworks(items), published);
  }
});

test("rotacja obejmuje całą kolekcję, także gdy liczba prac nie jest podzielna przez trzy", () => {
  for (const count of [4, 5, 6, 10, 31]) {
    const items = Array.from({ length: count }, (_, index) => ({
      id: String(index),
      status: "published" as const,
    }));
    const occurrences = new Map<string, number>();
    for (let week = 0; week < count; week++) {
      const date = new Date(Date.UTC(2026, 9, 5 + week * 7, 12));
      const selection = selectWeeklyArtworks(items, date);
      assert.equal(selection.length, 3);
      assert.equal(new Set(selection.map((item) => item.id)).size, 3);
      for (const item of selection) occurrences.set(item.id, (occurrences.get(item.id) ?? 0) + 1);
    }
    assert.equal(occurrences.size, count);
    assert.ok([...occurrences.values()].every((value) => value === 3));
  }
});
