import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import { NotificationProvider } from "@/components/ui/Notifications";
import { ThemeProvider } from "@/components/ThemeProvider";

// פונט מקומי — Discovery FS (כל 8 המשקלים), תומך עברית
const discovery = localFont({
  variable: "--font-discovery",
  display: "swap",
  src: [
    { path: "./fonts/discovery-thin.ttf", weight: "100", style: "normal" },
    { path: "./fonts/discovery-ultralight.ttf", weight: "200", style: "normal" },
    { path: "./fonts/discovery-light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/discovery-regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/discovery-medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/discovery-demibold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/discovery-bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/discovery-black.ttf", weight: "900", style: "normal" },
  ],
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
    <html lang="he" dir="rtl" className={`${discovery.variable} antialiased`} suppressHydrationWarning>
      <body className="flex flex-col">
        <ThemeProvider>
          <NotificationProvider>
            <SmoothScroll>
              <ScrollProgress />
              <NavBar />
              {children}
            </SmoothScroll>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
