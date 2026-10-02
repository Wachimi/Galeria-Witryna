import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Facebook } from "lucide-react";
import { navigation, site } from "@/data/site";
import { OpeningHours } from "@/components/opening-hours";
import { formatPolishText } from "@/lib/typography";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Image src="/images/witryna-logo.png" alt="Galeria Witryna" width={187} height={37} />
          <p>
            Sztuka, która zostaje z&nbsp;Tobą.
            <br />
            Zapraszamy do naszej galerii w&nbsp;Lublinie.
          </p>
        </div>
        <nav aria-label="Menu w stopce">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {formatPolishText(item.label)}
            </Link>
          ))}
        </nav>
        <div className="footer-contact">
          <span>
            {formatPolishText(site.address)}, {site.postalCode} {formatPolishText(site.city)}
          </span>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>
            {site.email} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a
            href={site.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <Facebook size={18} aria-hidden="true" />
            Facebook <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <div className="footer-hours">
            <p className="eyebrow">GODZINY OTWARCIA</p>
            <OpeningHours />
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Galeria Sztuki Witryna</span>
        <Link href="/logowanie">
          Panel redakcyjny <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
