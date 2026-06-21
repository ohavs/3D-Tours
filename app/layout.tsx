import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Assistant } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

// פונט הכותרות — serif עברי עריכותי (תחליף ל-ppmondwest)
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500"],
});

// פונט הגוף — sans עברי נקי (תחליף ל-af)
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "סיורים וירטואליים 360°",
  description: 'פלטפורמה לסיורים וירטואליים 360° לנדל"ן',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frankRuhl.variable} ${assistant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
