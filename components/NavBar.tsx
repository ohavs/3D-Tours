'use client'

// ============================================================
// components/NavBar.tsx — קפסולה צפה (Ventriloc):
// פיל לבן יחיד עם wordmark, קישורים, וכפתור. הקישור של הסקשן
// שנמצאים בו מודגש (scroll-spy) — מסגרת/רקע סביב האלמנט הפעיל.
// מוסתר בדפי הסיור (/tour/...).
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const LINKS = [
  { id: 'service', label: 'השירות' },
  { id: 'pricing', label: 'מחירים' },
  { id: 'faq', label: 'שאלות' },
  { id: 'contact', label: 'צור קשר' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [active, setActive] = useState('')

  useEffect(() => {
    if (pathname?.startsWith('/tour/')) return
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    ) as HTMLElement[]
    if (!sections.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [pathname])

  if (pathname?.startsWith('/tour/')) return null

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <nav className="flex items-center gap-1 rounded-full border border-slate/30 bg-paper/90 p-1.5 pr-4 shadow-soft backdrop-blur-md">
        {/* wordmark */}
        <Link href="/" className="px-3 text-[20px] font-extrabold tracking-tight text-carbon">
          tour<span className="text-signal">.</span>360
        </Link>

        {/* קישורים עם הדגשת הסקשן הפעיל */}
        <div className="hidden items-center sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`rounded-full px-3.5 py-2 text-caption font-medium transition-colors ${
                active === l.id
                  ? 'bg-chalk font-semibold text-carbon'
                  : 'text-graphite hover:text-carbon'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* כפתור */}
        <Link
          href="/tour/test"
          className="ml-1 rounded-full bg-carbon px-5 py-2.5 text-caption font-semibold text-paper transition-opacity hover:opacity-85"
        >
          סיור לדוגמה
        </Link>
      </nav>
    </div>
  )
}
