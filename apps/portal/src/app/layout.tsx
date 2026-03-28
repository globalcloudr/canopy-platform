import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canopy Portal",
  description: "The shared platform portal for Canopy products and workspaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
