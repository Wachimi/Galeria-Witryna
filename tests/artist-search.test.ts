import assert from "node:assert/strict";
import test from "node:test";
import { filterAndSortArtists } from "../src/lib/artist-search.ts";

const artists = [
  { name: "Dariusz Żejmo" },
  { name: "Piotr Fąfrowicz" },
  { name: "Jerzy Wojciech Bielecki" },
  { name: "Alicja Słaboń-Urbaniak" },
  { name: "Marek Andała" },
  { name: "Theseus" },
];

test("sortuje według nazwiska, zachowując nazwiska z myślnikiem i pseudonimy", () => {
  const ordered = filterAndSortArtists(artists, "", "asc");
  assert.deepEqual(
    ordered.map((item) => item.name),
    [
      "Marek Andała",
      "Jerzy Wojciech Bielecki",
      "Piotr Fąfrowicz",
      "Alicja Słaboń-Urbaniak",
      "Theseus",
      "Dariusz Żejmo",
    ],
  );
  assert.equal(artists[0].name, "Dariusz Żejmo");
  assert.deepEqual(filterAndSortArtists(artists, "", "desc"), [...ordered].reverse());
});

test("wyszukuje bez polskich znaków, wielkości liter i niezależnie od kolejności imienia i nazwiska", () => {
  assert.deepEqual(filterAndSortArtists(artists, "  ANDALA   marek ", "asc"), [
    { name: "Marek Andała" },
  ]);
  assert.deepEqual(filterAndSortArtists(artists, "fafrowicz", "desc"), [
    { name: "Piotr Fąfrowicz" },
  ]);
  assert.deepEqual(filterAndSortArtists(artists, "SLABON", "asc"), [
    { name: "Alicja Słaboń-Urbaniak" },
  ]);
  assert.deepEqual(filterAndSortArtists(artists, "nieistniejacy", "asc"), []);
});

test("uwzględnia polski alfabet i porządkuje takie same nazwiska po imieniu", () => {
  assert.deepEqual(
    filterAndSortArtists(
      [
        { name: "Jan Żak" },
        { name: "Jan Źrebak" },
        { name: "Piotr Zawadzki" },
        { name: "Adam Zawadzki" },
      ],
      "",
      "asc",
    ).map((item) => item.name),
    ["Adam Zawadzki", "Piotr Zawadzki", "Jan Źrebak", "Jan Żak"],
  );
});
