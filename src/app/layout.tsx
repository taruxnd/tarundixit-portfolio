import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import ThemeInitScript from "@/components/ThemeInitScript";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeInitScript />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
