'use client'

// ============================================================
// components/SmoothScroll.tsx
// גלילה חלקה לכל האתר (Lenis). autoRaf=true נותן ל-Lenis לנהל
// את לולאת ה-rAF בעצמו — הכי אמין.
// ============================================================

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
