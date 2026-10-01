import type { Metadata } from "next";
import localFont from "next/font/local";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

const bodyFont = localFont({
  src: [
    { path: "../assets/fonts/dm-sans-regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/dm-sans-medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/dm-sans-semibold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const displayFont = localFont({
  src: [
    { path: "../assets/fonts/playfair-regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/playfair-italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Galeria Witryna — sztuka współczesna w Lublinie",
    template: "%s | Galeria Witryna",
  },
  description:
    "Poznaj artystów i sztukę współczesną w Galerii Witryna. Malarstwo, grafika i rzeźba. Zapraszamy na ul. Chopina 1 w Lublinie.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Galeria Sztuki Witryna",
    images: [
      { url: "/images/gallery-wall.jpg", width: 658, height: 498, alt: "Wnętrze Galerii Witryna" },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
