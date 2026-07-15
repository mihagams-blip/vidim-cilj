import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vidimcilj.si"),
  title: {
    default: "Vidim cilj — gibanje, ki odpira svet",
    template: "%s | Vidim cilj",
  },
  description:
    "Otrokom in mladim z različnimi oviranostmi omogočamo prilagojene športne aktivnosti, skozi katere rastejo samozavest, samostojnost in prijateljstva.",
  openGraph: {
    title: "Vidim cilj — gibanje, ki odpira svet",
    description:
      "Vsak otrok vidi svoj cilj. Mi mu pomagamo priti do njega.",
    locale: "sl_SI",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#073f75",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sl" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
