import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
    <html
      lang="en"
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className={`${inter.variable} font-sans antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
