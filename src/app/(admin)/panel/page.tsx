import Link from "next/link";
import { getEditorCatalog } from "@/lib/panel";

export default async function PanelPage() {
  const { artists, artworks } = await getEditorCatalog();
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Twoja galeria.</h1>
          <p>Zarządzaj artystami i&nbsp;pracami prezentowanymi na stronie.</p>
        </div>
      </div>
      <div className="panel-stats">
        <div className="panel-stat">
          <strong>{artists.length}</strong>
          <span>Artyści</span>
        </div>
        <div className="panel-stat">
          <strong>{artworks.length}</strong>
          <span>Prace w&nbsp;katalogu</span>
        </div>
        <div className="panel-stat">
          <strong>{artworks.filter((work) => work.status === "draft").length}</strong>
          <span>Szkice prac</span>
        </div>
      </div>
      <div className="notice">
        Nowe treści możesz zapisać jako szkic. Praca pojawi się na stronie po opublikowaniu jej oraz
        profilu artysty.
      </div>
      <div className="form-actions">
        <Link className="button button-dark" href="/panel/prace/nowa">
          Dodaj pracę ↗
        </Link>
        <Link className="button button-outline" href="/panel/artysci/nowy">
          Dodaj artystę ↗
        </Link>
      </div>
    </>
  );
}
