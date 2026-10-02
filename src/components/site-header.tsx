"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Facebook, Menu, X } from "lucide-react";
import { useState } from "react";
import { navigation, site } from "@/data/site";
import { formatPolishText } from "@/lib/typography";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          scroll={false}
          className="brand"
          aria-label="Galeria Witryna — strona główna"
          onClick={() => setOpen(false)}
          onNavigate={() => {
            // Własne przewijanie uwzględnia przyklejony header i działa też na stronie głównej.
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          <Image src="/images/witryna-logo.png" alt="Witryna" width={187} height={37} priority />
          <span>GALERIA SZTUKI · LUBLIN</span>
        </Link>
        <nav
          id="main-navigation"
          className={`main-nav ${open ? "is-open" : ""}`}
          aria-label="Menu główne"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {formatPolishText(item.label)}
            </Link>
          ))}
          <Link href="/kolekcja" className="nav-cta" onClick={() => setOpen(false)}>
            Odkryj sztukę <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </nav>
        <div className="header-actions">
          <a
            href={site.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="header-facebook"
            aria-label="Galeria Witryna na Facebooku"
            title="Galeria Witryna na Facebooku"
          >
            <Facebook size={22} aria-hidden="true" />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
