"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="centered-page">
      <p className="eyebrow">GALERIA WITRYNA</p>
      <h1>Chwila przerwy.</h1>
      <p>Nie udało się wczytać tej strony. Spróbuj ponownie za moment.</p>
      <button className="button button-dark" type="button" onClick={reset}>
        Spróbuj ponownie
      </button>
    </div>
  );
}
