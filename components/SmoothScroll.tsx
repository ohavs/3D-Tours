'use client'

// ============================================================
// components/SmoothScroll.tsx
// גלילה חלקה לכל האתר (Lenis), בלולאת requestAnimationFrame.
// lerp נמוך = "החלקה כמו חמאה" (glide רך עם מומנטום).
// ============================================================

import { useEffect } from 'react'
import Lenis from 'lenis'

function motionStopped() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  try {
    const s = JSON.parse(localStorage.getItem('a11y-settings') || '{}')
    return !!s.stop
  } catch {
    return false
  }
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    let lenis: Lenis | null = null
    let rafId = 0

    function start() {
      if (lenis || motionStopped()) return
      lenis = new Lenis({
        lerp: 0.075, // ככל שנמוך יותר — הגלילה רכה וזורמת יותר
        wheelMultiplier: 1.1,
        smoothWheel: true,
      })
      const raf = (time: number) => {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }
    function stop() {
      cancelAnimationFrame(rafId)
      lenis?.destroy()
      lenis = null
    }

    start()

    // עצירת אנימציות בתפריט הנגישות → ביטול הגלילה החלקה
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onA11y(e: any) {
      if (e.detail?.stop) stop()
      else start()
    }
    window.addEventListener('a11y-change', onA11y)

    return () => {
      window.removeEventListener('a11y-change', onA11y)
      stop()
    }
  }, [])

  return <>{children}</>
}
