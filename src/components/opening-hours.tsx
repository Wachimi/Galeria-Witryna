import { site } from "@/data/site";

export function OpeningHours() {
  return (
    <dl className="opening-hours">
      {site.openingHours.map(({ days, hours }) => (
        <div key={days}>
          <dt>{days}</dt>
          <dd>{hours}</dd>
        </div>
      ))}
    </dl>
  );
}
