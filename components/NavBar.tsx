'use client'

// ============================================================
// components/NavBar.tsx
// מובייל — שני מצבים:
//   • TOP  (לפני גלילה): פיל ימין (wordmark+toggle+CTA) + המבורגר שמאל
//   • SCROLLED (אחרי גלילה מעבר ל-hero): פיל מרכזי + המבורגר בתוכו, CTA נעלם
// דסקטופ — פיל מרכזי עם כל הקישורים (ללא שינוי).
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

const LINKS = [
  { id: 'service', label: 'השירות' },
  { id: 'pricing', label: 'מחירים' },
  { id: 'faq', label: 'שאלות' },
  { id: 'contact', label: 'צור קשר' },
]

function smoothTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = (window as unknown as {
    __lenis?: { scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void }
  }).__lenis
  if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// אייקון המבורגר/סגירה עם אנימציה
function BurgerIcon({ open }: { open: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={open ? 'x' : 'menu'}
        initial={{ opacity: 0, rotate: open ? -30 : 30 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.13 }}
        className="flex items-center justify-center"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </motion.span>
    </AnimatePresence>
  )
}

export default function NavBar() {
  const pathname = usePathname()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const hidden =
    pathname?.startsWith('/tour/') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/studio') ||
    pathname?.startsWith('/lab')

  // גלילה מעבר ל-60% מגובה המסך → מעבר למצב ממוזג
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // סגירת תפריט במעבר בין מצבים
  useEffect(() => { if (scrolled) setOpen(false) }, [scrolled])

  useEffect(() => {
    if (hidden) return
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }) },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [hidden])

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

  const PILL = 'flex items-center gap-1 rounded-full border border-border bg-surface/85 p-1.5 pr-3 shadow-soft backdrop-blur-md'
  const BURGER_BTN = 'flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted'
  const DROPDOWN = 'rounded-3xl border border-border bg-surface/95 p-2 shadow-card backdrop-blur-md'
  const LINK_CLS = (id: string) =>
    `block rounded-2xl px-4 py-3 text-body font-medium transition-colors ${
      active === id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
    }`
  const DROP_MOTION = {
    initial: { opacity: 0, y: -8, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.97 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }

  const navLinks = LINKS.map((l) => (
    <a key={l.id} href={`#${l.id}`} onClick={(e) => go(e, l.id)} className={LINK_CLS(l.id)}>
      {l.label}
    </a>
  ))

  return (
    <div ref={wrapRef} className="fixed inset-x-0 top-4 z-50 px-4">

      {/* ══════════════════════════════════════
          מובייל (sm:hidden) — שני מצבי תצוגה
          ══════════════════════════════════════ */}
      <LayoutGroup id="mobile-nav">
        <div className="sm:hidden">
          <AnimatePresence mode="wait">

            {/* ── מצב TOP: פיל ימין + המבורגר שמאל ── */}
            {!scrolled && (
              <motion.div
                key="split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
                className="flex items-start justify-between"
              >
                {/* ימין: פיל עם wordmark + toggle + CTA */}
                <motion.nav layoutId="mpill" className={PILL}>
                  <Link href="/" className="px-2.5 text-[18px] font-extrabold tracking-tight text-foreground">
                    tour<span className="text-accent">.</span>360
                  </Link>
                  <ThemeToggle />
                  <Link
                    href="/tour/test"
                    className="mr-0.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-85"
                  >
                    סיור לדוגמה
                  </Link>
                </motion.nav>

                {/* שמאל: המבורגר — relative כדי שהdropdown יהיה absolute */}
                <div className="relative">
                  <motion.button
                    layoutId="mburger"
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
                    aria-expanded={open}
                    className={`${BURGER_BTN} bg-surface/85 shadow-soft backdrop-blur-md`}
                  >
                    <BurgerIcon open={open} />
                  </motion.button>

                  {/* תפריט: absolute — לא משנה את layout הכפתור */}
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        key="dd-split"
                        {...DROP_MOTION}
                        className={`absolute left-0 top-full mt-2 w-[min(80vw,240px)] origin-top-left ${DROPDOWN}`}
                      >
                        {navLinks}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── מצב SCROLLED: פיל מרכזי + המבורגר בתוכו ── */}
            {scrolled && (
              <motion.div
                key="merged"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ duration: 0.22, delay: 0.05 }}
                className="flex flex-col items-center"
              >
                <motion.nav layoutId="mpill" className={PILL}>
                  <Link href="/" className="px-2.5 text-[18px] font-extrabold tracking-tight text-foreground">
                    tour<span className="text-accent">.</span>360
                  </Link>
                  <ThemeToggle />
                  <motion.button
                    layoutId="mburger"
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
                    aria-expanded={open}
                    className={`mr-0.5 ${BURGER_BTN}`}
                  >
                    <BurgerIcon open={open} />
                  </motion.button>
                </motion.nav>

                {/* תפריט מתחת לפיל במצב ממוזג */}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="dd-merged"
                      {...DROP_MOTION}
                      className={`mt-2 w-[min(90vw,280px)] origin-top ${DROPDOWN}`}
                    >
                      {navLinks}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* ══════════════════════════════════════
          דסקטופ: פיל מרכזי עם כל הקישורים
          ══════════════════════════════════════ */}
      <div className="hidden sm:flex sm:justify-center">
        <nav
          className={PILL}
          style={{ viewTransitionName: 'navbar' }}
        >
          <Link href="/" className="px-3 text-[20px] font-extrabold tracking-tight text-foreground">
            tour<span className="text-accent">.</span>360
          </Link>
          <div className="flex items-center">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => go(e, l.id)}
                className={`rounded-full px-3.5 py-2 text-caption font-medium transition-colors ${
                  active === l.id ? 'bg-muted font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
          <ThemeToggle className="ml-1" />
          <Link
            href="/tour/test"
            className="ml-1 rounded-full bg-foreground px-5 py-2.5 text-caption font-semibold text-background transition-opacity hover:opacity-85"
          >
            סיור לדוגמה
          </Link>
        </nav>
      </div>
    </div>
  )
}
