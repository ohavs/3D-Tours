'use client'

// ============================================================
// components/SmoothScroll.tsx
// גלילה חלקה לכל האתר (Lenis), בלולאת requestAnimationFrame
// סטנדרטית — הדרך האמינה ביותר גם בדסקטופ.
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
      lerp: 0.09, // האטה רציפה וטבעית (לא "דביק")
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
