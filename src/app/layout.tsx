import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dark Portal Guild | TBC Classic",
  description: "Join our dedicated World of Warcraft: The Burning Crusade Classic guild. Epic raids, lasting friendships, and legendary loot await.",
  keywords: ["WoW", "World of Warcraft", "TBC", "The Burning Crusade", "Classic", "Guild", "Raiding"],
  openGraph: {
    title: "Dark Portal Guild | TBC Classic",
    description: "Join our dedicated TBC Classic guild as we conquer Outland together.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${cinzel.variable} bg-obsidian text-text-primary antialiased`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
