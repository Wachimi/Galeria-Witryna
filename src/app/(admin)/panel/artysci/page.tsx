import Link from "next/link";
import { getEditorCatalog } from "@/lib/panel";

export default async function PanelArtistsPage() {
  const { artists, artworks } = await getEditorCatalog();
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Artyści</h1>
          <p>Biografie i profile twórców galerii.</p>
        </div>
        <Link className="button button-dark" href="/panel/artysci/nowy">
          Dodaj artystę ↗
        </Link>
      </div>
      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Artysta</th>
              <th>Prace</th>
              <th>Status</th>
              <th>Edycja</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id}>
                <td>{artist.name}</td>
                <td>{artworks.filter((work) => work.artist_id === artist.id).length}</td>
                <td>
                  <span className={`badge ${artist.status}`}>
                    {artist.status === "published" ? "Opublikowany" : "Szkic"}
                  </span>
                </td>
                <td>
                  <Link href={`/panel/artysci/${artist.id}`}>Edytuj</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!artists.length && (
        <p className="empty-state">Dodaj pierwszego artystę, aby rozpocząć tworzenie katalogu.</p>
      )}
    </>
  );
}
