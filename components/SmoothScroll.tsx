'use client'

// ============================================================
// components/SmoothScroll.tsx
// גלילה חלקה (smooth scroll) לכל האתר באמצעות Lenis.
// זה מה שנותן את התחושה ה"פרימיום" — הגלילה זורמת, וכל אנימציות
// ה-scroll של framer-motion מתנגנות עליה בצורה חלקה.
// 'use client' כי זה רץ בדפדפן בלבד.
// ============================================================

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // כיבוד העדפת נגישות: מי שביקש פחות תנועה — לא מקבל smooth scroll
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.1, // משך ההאטה — תחושת "משקל" נעימה
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    })

    let rafId = 0
    const raf = (time: number) => {
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
