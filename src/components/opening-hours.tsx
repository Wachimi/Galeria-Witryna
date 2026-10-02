import { site } from "@/data/site";
import { formatPolishText } from "@/lib/typography";

export function OpeningHours() {
  return (
    <dl className="opening-hours">
      {site.openingHours.map(({ days, hours }) => (
        <div key={days}>
          <dt>{formatPolishText(days)}</dt>
          <dd>{formatPolishText(hours)}</dd>
        </div>
      ))}
    </dl>
  );
}
