import Link from "next/link";
import { getEditorCatalog } from "@/lib/panel";
import { availabilityLabels } from "@/types/catalog";
import { formatPolishText } from "@/lib/typography";

export default async function PanelArtworksPage() {
  const { artists, artworks } = await getEditorCatalog();
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Prace</h1>
          <p>Zdjęcia, opisy i&nbsp;dostępność prac.</p>
        </div>
        <Link className="button button-dark" href="/panel/prace/nowa">
          Dodaj pracę ↗
        </Link>
      </div>
      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Tytuł</th>
              <th>Artysta</th>
              <th>Dostępność</th>
              <th>Status</th>
              <th>Edycja</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((work) => (
              <tr key={work.id}>
                <td>{formatPolishText(work.title)}</td>
                <td>
                  {formatPolishText(artists.find((artist) => artist.id === work.artist_id)?.name)}
                </td>
                <td>{formatPolishText(availabilityLabels[work.availability])}</td>
                <td>
                  <span className={`badge ${work.status}`}>
                    {work.status === "published" ? "Opublikowana" : "Szkic"}
                  </span>
                </td>
                <td>
                  <Link href={`/panel/prace/${work.id}`}>Edytuj</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!artworks.length && (
        <p className="empty-state">
          Katalog jest pusty. Dodaj artystę, a&nbsp;następnie pierwszą pracę.
        </p>
      )}
    </>
  );
}
