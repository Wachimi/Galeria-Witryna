import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { ExhibitionCard } from "@/components/exhibition-card";
import { exhibitions } from "@/data/exhibitions";

export const metadata: Metadata = {
  title: "Wystawy",
  description:
    "Archiwum wystaw Galerii Witryna. Poznaj artystów, ekspozycje i zdjęcia z wernisaży.",
};

export default function ExhibitionsPage() {
  const [featured, ...archive] = exhibitions;
  return (
    <div className="container page-section">
      <PageHeading
        eyebrow="SPOTKANIA ZE SZTUKĄ"
        title="Wystawy w Witrynie."
        description="Sztuka, artyści i spotkania, które tworzą historię naszej galerii. Zapraszamy do obejrzenia archiwalnych wystaw i fotografii z wernisaży."
      />
      <p className="exhibition-archive-count">ARCHIWUM · {exhibitions.length} WYSTAW</p>
      <h2 className="exhibition-section-heading">Ostatnia wystawa</h2>
      <ExhibitionCard exhibition={featured} featured />
      <div className="exhibition-archive">
        {archive.map((exhibition) => (
          <ExhibitionCard key={exhibition.slug} exhibition={exhibition} />
        ))}
      </div>
    </div>
  );
}
