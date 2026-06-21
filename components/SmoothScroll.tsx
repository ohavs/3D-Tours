'use client'

// ============================================================
// components/SmoothScroll.tsx
// גלילה חלקה לכל האתר (Lenis), בלולאת requestAnimationFrame.
// lerp נמוך = "החלקה כמו חמאה" (glide רך עם מומנטום).
// ============================================================

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075, // ככל שנמוך יותר — הגלילה רכה וזורמת יותר
      wheelMultiplier: 1.1,
      smoothWheel: true,
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
