import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bible Commerciale — UPVD",
  description: "Application de formation commerciale pour startups — Incubateur UPVD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
