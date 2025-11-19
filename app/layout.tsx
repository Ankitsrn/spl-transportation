import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPL Transportation - Professional Airport & City Transfers",
  description: "Reliable taxi services across Queensland. Book your transfer from Port Douglas, Cairns, Palm Cove and more.",
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