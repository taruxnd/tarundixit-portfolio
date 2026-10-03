import type { Metadata } from "next";
import "./framer.css";

export const metadata: Metadata = {
  title: "Flowing Timeline",
  description: "Made with Framer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* fonts */}</head>
      <body>{children}</body>
    </html>
  );
}
