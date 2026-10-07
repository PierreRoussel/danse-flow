import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Le Bal — pupitre multi-playlists",
  description:
    "Playlists de mariage et d’événement : lecture MP3 locale, pupitre Le Bal avec consignes, playlists simplifiées Repas, Blind test et Baseball.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`dark ${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
