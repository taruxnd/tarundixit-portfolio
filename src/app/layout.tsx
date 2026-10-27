import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

// Self-hosted (src/fonts) so builds never fetch from Google Fonts.
const inter = localFont({
  src: "../fonts/inter.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Tarun Dixit Portfolio",
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
