import type { Metadata } from "next";
import "./framer.css";

export const metadata: Metadata = {
  title: "Polaroid Timeline",
  description: "Polaroid Timeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={"https://fonts.gstatic.com/"} />
      </head>
      <body>{children}</body>
    </html>
  );
}
