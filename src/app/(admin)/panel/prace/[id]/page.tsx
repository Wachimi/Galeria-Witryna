import { notFound } from "next/navigation";
import { ArtworkForm } from "@/components/editor-forms";
import { getEditorCatalog } from "@/lib/panel";
import { formatPolishText } from "@/lib/typography";

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { artists, artworks } = await getEditorCatalog();
  const artwork = artworks.find((item) => item.id === id);
  if (!artwork) notFound();
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Edytuj pracę</h1>
          <p>{formatPolishText(artwork.title)}</p>
        </div>
      </div>
      <ArtworkForm artwork={artwork} artists={artists} />
    </>
  );
}
