import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

// פונט יחיד לכל הטקסט — Assistant (sans עברי נקי)
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
    <html lang="he" dir="rtl" className={`${assistant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
