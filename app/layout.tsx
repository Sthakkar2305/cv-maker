import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium ATS Resume Builder",
  description: "A modern responsive resume builder with adaptive typography, ATS-safe markup, and A4 PDF export."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
