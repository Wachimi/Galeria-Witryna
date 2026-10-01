import { ArtworkForm } from "@/components/editor-forms";
import { getEditorCatalog } from "@/lib/panel";

export default async function NewArtworkPage() {
  const { artists } = await getEditorCatalog();
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Nowa praca</h1>
          <p>Dodaj zdjęcie, podpis i informacje o pracy.</p>
        </div>
      </div>
      <ArtworkForm artists={artists} />
    </>
  );
}
