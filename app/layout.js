import { Inter } from "next/font/google";
import "./globals.css";
import FloatingSaweria from "@/components/FloatingSaweria";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dundunpildun",
  description: "Random draw Piala Dunia 2026 — bagi tim ke teman-temanmu!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <FloatingSaweria />
      </body>
    </html>
  );
}
