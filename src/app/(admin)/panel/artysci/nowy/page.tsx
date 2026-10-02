import { ArtistForm } from "@/components/editor-forms";

export default function NewArtistPage() {
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Nowy artysta</h1>
          <p>Uzupełnij profil i&nbsp;zdecyduj, kiedy go opublikować.</p>
        </div>
      </div>
      <ArtistForm />
    </>
  );
}
