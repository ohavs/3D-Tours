'use client'

// ============================================================
// components/NavBar.tsx — קפסולה צפה (Ventriloc):
// פיל צף עם wordmark, קישורים, מתג מצב וכפתור. בדסקטופ הקישורים
// גלויים; במובייל יש כפתור המבורגר (3 פסים בעיגול) שפותח תפריט.
// לחיצה על ניווט גוללת *חלק* לסקשן (Lenis), לא קפיצה חדה.
// מוסתר בדפי הסיור/אדמין/לאב.
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

const LINKS = [
  { id: 'service', label: 'השירות' },
  { id: 'pricing', label: 'מחירים' },
  { id: 'faq', label: 'שאלות' },
  { id: 'contact', label: 'צור קשר' },
]

// גלילה חלקה לסקשן דרך Lenis (עם נפילה ל-scrollIntoView אם מושבת)
function smoothTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = (window as unknown as {
    __lenis?: { scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void }
  }).__lenis
  if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function NavBar() {
  const pathname = usePathname()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const hidden =
    pathname?.startsWith('/tour/') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/studio') ||
    pathname?.startsWith('/lab')

  useEffect(() => {
    if (hidden) return
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
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
  }, [hidden])

  // סגירת התפריט בלחיצה בחוץ / Escape
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (hidden) return null

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault()
    setOpen(false)
    smoothTo(id)
  }

  return (
    <div ref={wrapRef} className="fixed inset-x-0 top-4 z-50 flex flex-col items-center px-4">
      <nav
        className="flex items-center gap-1 rounded-full border border-border bg-surface/85 p-1.5 pr-3 shadow-soft backdrop-blur-md"
        style={{ viewTransitionName: 'navbar' }}
      >
        {/* wordmark */}
        <Link href="/" className="px-3 text-[20px] font-extrabold tracking-tight text-foreground">
          tour<span className="text-accent">.</span>360
        </Link>

        {/* קישורים (דסקטופ) עם הדגשת הסקשן הפעיל + גלילה חלקה */}
        <div className="hidden items-center sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => go(e, l.id)}
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

        {/* המבורגר (מובייל בלבד) — בצד שמאל של הפיל */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
          aria-expanded={open}
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted sm:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* תפריט נפתח (מובייל) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 w-[min(90vw,300px)] origin-top rounded-3xl border border-border bg-surface/95 p-2 shadow-card backdrop-blur-md sm:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => go(e, l.id)}
                className={`block rounded-2xl px-4 py-3 text-body font-medium transition-colors ${
                  active === l.id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
