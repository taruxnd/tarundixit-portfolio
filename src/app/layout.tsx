import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import ThemeInitScript from "@/components/ThemeInitScript";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Product Designer Portfolio",
  description:
    "Product designer crafting AI products, scalable design systems, and thoughtful user experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${caveat.variable} font-sans antialiased`}>
        <ThemeInitScript />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
