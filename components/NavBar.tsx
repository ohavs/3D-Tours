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
import ThemeToggle from '@/components/ThemeToggle'

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
    if (
      pathname?.startsWith('/tour/') ||
      pathname?.startsWith('/admin') ||
      pathname?.startsWith('/studio') ||
      pathname?.startsWith('/lab')
    )
      return
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

  if (
    pathname?.startsWith('/tour/') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/studio') ||
    pathname?.startsWith('/lab')
  )
    return null

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className="flex items-center gap-1 rounded-full border border-border bg-surface/85 p-1.5 pr-3 shadow-soft backdrop-blur-md"
        style={{ viewTransitionName: 'navbar' }}
      >
        {/* wordmark */}
        <Link
          href="/"
          className="px-3 text-[20px] font-extrabold tracking-tight text-foreground"
        >
          tour<span className="text-accent">.</span>360
        </Link>

        {/* קישורים עם הדגשת הסקשן הפעיל */}
        <div className="hidden items-center sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`rounded-full px-3.5 py-2 text-caption font-medium transition-colors ${
                active === l.id
                  ? 'bg-muted font-semibold text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <ThemeToggle className="ml-1" />

        {/* כפתור — היפוך צבעים אדיטוריאלי (שחור בבהיר, לבן בכהה) */}
        <Link
          href="/tour/test"
          className="ml-1 rounded-full bg-foreground px-5 py-2.5 text-caption font-semibold text-background transition-opacity hover:opacity-85"
        >
          סיור לדוגמה
        </Link>
      </nav>
    </div>
  )
}
