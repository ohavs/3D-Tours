import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SmoothScroll from "@/components/SmoothScroll";

// פונט יחיד — Heebo (וייב Google Sans, תמיכה מלאה בעברית)
const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="he" dir="rtl" className={`${heebo.variable} antialiased`}>
      <body className="flex flex-col">
        <SmoothScroll>
          <NavBar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
