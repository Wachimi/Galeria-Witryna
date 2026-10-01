import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Image src="/images/witryna-logo.png" alt="Galeria Witryna" width={187} height={37} />
          <p>
            Sztuka, która zostaje z Tobą.
            <br />
            Zapraszamy do naszej galerii w Lublinie.
          </p>
        </div>
        <nav aria-label="Menu w stopce">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="footer-contact">
          <span>
            {site.address}, {site.city}
          </span>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>
            {site.email} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
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
