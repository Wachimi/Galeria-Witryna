import { notFound } from "next/navigation";
import { ArtistForm } from "@/components/editor-forms";
import { getEditorCatalog } from "@/lib/panel";
import { formatPolishText } from "@/lib/typography";

export default async function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { artists } = await getEditorCatalog();
  const artist = artists.find((item) => item.id === id);
  if (!artist) notFound();
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Edytuj artystę</h1>
          <p>{formatPolishText(artist.name)}</p>
        </div>
      </div>
      <ArtistForm artist={artist} />
    </>
  );
}
