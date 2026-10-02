import { formatPolishText } from "@/lib/typography";

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{formatPolishText(eyebrow)}</p>
      <h1>{formatPolishText(title)}</h1>
      {description && <p className="page-description">{formatPolishText(description)}</p>}
    </div>
  );
}
