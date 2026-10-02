import Link from "next/link";

export default function NotFound() {
  return (
    <main className="centered-page">
      <p className="eyebrow">404 · GALERIA WITRYNA</p>
      <h1>Tej strony tu nie ma.</h1>
      <p>Przejdź do kolekcji, aby odkryć prace i&nbsp;artystów naszej galerii.</p>
      <Link href="/kolekcja" className="button button-dark">
        Wróć do kolekcji
      </Link>
    </main>
  );
}
