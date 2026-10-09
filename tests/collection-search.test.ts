import assert from "node:assert/strict";
import test from "node:test";
import { starterCatalog } from "../src/data/catalog.ts";
import {
  collectionArtists,
  filterCollection,
  type CollectionFilters,
} from "../src/lib/collection-search.ts";

const filters: CollectionFilters = { category: "all", artist: "", query: "", order: "asc" };

test("dzieli prace według autorów i sortuje sekcje po nazwisku w polskim alfabecie", () => {
  const snapshot = structuredClone(starterCatalog);
  const groups = filterCollection(starterCatalog, filters);
  assert.deepEqual(
    groups.map((group) => group.artist?.name),
    ["Marek Andała", "Piotr Fąfrowicz", "Jerzy Tyburski"],
  );
  assert.equal(groups.flatMap((group) => group.artworks).length, starterCatalog.artworks.length);
  assert.ok(
    groups.every((group) => group.artworks.every((work) => work.artist_id === group.artist?.id)),
  );
  assert.deepEqual(
    filterCollection(starterCatalog, { ...filters, order: "desc" }).map(
      (group) => group.artist?.id,
    ),
    groups.map((group) => group.artist?.id).reverse(),
  );
  assert.deepEqual(starterCatalog, snapshot);
});

test("wyszukuje tytuł, nazwisko i technikę bez polskich znaków, niezależnie od kolejności słów", () => {
  const groups = filterCollection(starterCatalog, { ...filters, query: " FAFROWICZ  wawoz OLEJ " });
  assert.equal(groups.length, 1);
  assert.equal(groups[0].artworks.length, 1);
  assert.equal(groups[0].artworks[0].slug, "wawoz-korzeniowy");
  assert.deepEqual(filterCollection(starterCatalog, { ...filters, query: "nieistniejacy" }), []);
});

test("łączy wybór artysty z dziedziną i wyszukiwaniem", () => {
  const catalog = structuredClone(starterCatalog);
  catalog.artworks.find((work) => work.slug === "stare-miasto")!.category = "grafika";
  const groups = filterCollection(catalog, {
    ...filters,
    artist: "piotr-fafrowicz",
    category: "grafika",
    query: "papier",
  });
  assert.deepEqual(
    groups.flatMap((group) => group.artworks.map((work) => work.slug)),
    ["stare-miasto"],
  );
  assert.deepEqual(
    filterCollection(catalog, { ...filters, artist: "marek-andala", category: "grafika" }),
    [],
  );
  assert.deepEqual(filterCollection(catalog, { ...filters, artist: "nieistniejacy" }), []);
});

test("wybór autorów obejmuje tylko tych z pracami, ale nie gubi pracy bez profilu w danych", () => {
  const catalog = structuredClone(starterCatalog);
  catalog.artists.push({
    ...catalog.artists[0],
    id: "empty",
    slug: "empty",
    name: "Artysta bez prac",
  });
  assert.equal(collectionArtists(catalog).length, starterCatalog.artists.length);
  catalog.artworks.push({ ...catalog.artworks[0], id: "orphan", artist_id: "unknown" });
  const groups = filterCollection(catalog, filters);
  assert.equal(groups.at(-1)?.artist, undefined);
  assert.equal(groups.at(-1)?.artworks[0].id, "orphan");
  assert.deepEqual(filterCollection({ artists: [], artworks: [] }, filters), []);
});
