'use client'

// ============================================================
// components/ThemeProvider.tsx — עוטף את next-themes.
// מצב בהיר/כהה דרך class על <html>, עם זיהוי העדפת מערכת.
// ============================================================

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemeProvider>
  )
}
