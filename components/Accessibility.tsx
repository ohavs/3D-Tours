'use client'

// ============================================================
// components/Accessibility.tsx — תפריט נגישות מלא (ת"י 5568 / WCAG 2.0 AA).
// כפתור צף קבוע + פאנל התאמות. הכל נשמר ב-localStorage ומיושם כ-classes
// על <html> (הפילטרים על #a11y-root). מונגש בעצמו: מקלדת, ARIA, Escape.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Accessibility as A11yIcon,
  X,
  Plus,
  Minus,
  RotateCcw,
  Link2,
  Heading,
  Type,
  Contrast,
  Droplet,
  PauseCircle,
  MousePointer2,
  AlignJustify,
  Eye,
  FileText,
} from 'lucide-react'

type ContrastMode = 'none' | 'grayscale' | 'invert' | 'contrast'

interface A11yState {
  scaleStep: number // index into SCALES
  contrast: ContrastMode
  links: boolean
  headings: boolean
  readable: boolean
  spacing: boolean
  stop: boolean
  bigCursor: boolean
  guide: boolean
}

const SCALES = [0.875, 1, 1.125, 1.25, 1.4, 1.6]
const DEFAULT: A11yState = {
  scaleStep: 1,
  contrast: 'none',
  links: false,
  headings: false,
  readable: false,
  spacing: false,
  stop: false,
  bigCursor: false,
  guide: false,
}

const STORAGE_KEY = 'a11y-settings'

function apply(s: A11yState) {
  const html = document.documentElement
  html.style.setProperty('--a11y-scale', String(SCALES[s.scaleStep] ?? 1))
  html.classList.toggle('a11y-grayscale', s.contrast === 'grayscale')
  html.classList.toggle('a11y-invert', s.contrast === 'invert')
  html.classList.toggle('a11y-contrast', s.contrast === 'contrast')
  html.classList.toggle('a11y-links', s.links)
  html.classList.toggle('a11y-headings', s.headings)
  html.classList.toggle('a11y-readable', s.readable)
  html.classList.toggle('a11y-spacing', s.spacing)
  html.classList.toggle('a11y-stop', s.stop)
  html.classList.toggle('a11y-bigcursor', s.bigCursor)
  // הסמן המותאם מכבה את עצמו כשסמן גדול/עצירת אנימציות פעילים
  window.dispatchEvent(new CustomEvent('a11y-change', { detail: s }))
}

export default function Accessibility() {
  const [open, setOpen] = useState(false)
  const [s, setS] = useState<A11yState>(DEFAULT)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const guideRef = useRef<HTMLDivElement>(null)

  // טעינה ראשונית
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const loaded = { ...DEFAULT, ...JSON.parse(raw) }
        setS(loaded)
        apply(loaded)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const update = useCallback((patch: Partial<A11yState>) => {
    setS((prev) => {
      const next = { ...prev, ...patch }
      apply(next)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  function reset() {
    setS(DEFAULT)
    apply(DEFAULT)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  // מדריך קריאה — עוקב אחרי הסמן
  useEffect(() => {
    if (!s.guide) return
    function move(e: MouseEvent) {
      if (guideRef.current) guideRef.current.style.top = `${e.clientY - 7}px`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [s.guide])

  // Escape לסגירה + פוקוס לפאנל בפתיחה
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const scalePct = Math.round((SCALES[s.scaleStep] ?? 1) * 100)

  return (
    <>
      {/* מדריך קריאה */}
      {s.guide && <div ref={guideRef} className="a11y-reading-guide" style={{ top: 0 }} />}

      {/* כפתור צף */}
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="תפריט נגישות"
        className="fixed bottom-5 left-5 z-[120] flex h-14 w-14 items-center justify-center rounded-full bg-[#1a56db] text-white shadow-lg outline-offset-2 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
        style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.28)', viewTransitionName: 'a11y-fab' }}
      >
        <A11yIcon size={28} />
      </button>

      {/* פאנל */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[120] bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="התאמות נגישות"
            tabIndex={-1}
            dir="rtl"
            className="fixed bottom-0 left-0 top-0 z-[130] flex w-[330px] max-w-[88vw] flex-col bg-white text-[#111] shadow-2xl outline-none"
          >
            {/* כותרת */}
            <div className="flex items-center justify-between border-b border-black/10 bg-[#1a56db] px-5 py-4 text-white">
              <span className="flex items-center gap-2 text-[18px] font-bold">
                <A11yIcon size={22} /> נגישות
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="סגור תפריט נגישות"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* גודל טקסט */}
              <Group title="גודל טקסט" icon={<Type size={18} />}>
                <div className="flex items-center gap-2">
                  <ConBtn
                    label="הקטן טקסט"
                    onClick={() => update({ scaleStep: Math.max(0, s.scaleStep - 1) })}
                    disabled={s.scaleStep === 0}
                  >
                    <Minus size={18} />
                  </ConBtn>
                  <span className="min-w-[64px] text-center text-[15px] font-bold tabular-nums">
                    {scalePct}%
                  </span>
                  <ConBtn
                    label="הגדל טקסט"
                    onClick={() => update({ scaleStep: Math.min(SCALES.length - 1, s.scaleStep + 1) })}
                    disabled={s.scaleStep === SCALES.length - 1}
                  >
                    <Plus size={18} />
                  </ConBtn>
                </div>
              </Group>

              {/* ניגודיות וצבע */}
              <Group title="ניגודיות וצבע" icon={<Contrast size={18} />}>
                <div className="grid grid-cols-2 gap-2">
                  <Toggle active={s.contrast === 'contrast'} onClick={() => update({ contrast: s.contrast === 'contrast' ? 'none' : 'contrast' })} icon={<Contrast size={17} />}>
                    ניגודיות גבוהה
                  </Toggle>
                  <Toggle active={s.contrast === 'grayscale'} onClick={() => update({ contrast: s.contrast === 'grayscale' ? 'none' : 'grayscale' })} icon={<Droplet size={17} />}>
                    גווני אפור
                  </Toggle>
                  <Toggle active={s.contrast === 'invert'} onClick={() => update({ contrast: s.contrast === 'invert' ? 'none' : 'invert' })} icon={<Eye size={17} />}>
                    היפוך צבעים
                  </Toggle>
                  <Toggle active={s.spacing} onClick={() => update({ spacing: !s.spacing })} icon={<AlignJustify size={17} />}>
                    ריווח שורות
                  </Toggle>
                </div>
              </Group>

              {/* הדגשות וקריאוּת */}
              <Group title="קריאוּת והדגשה" icon={<Eye size={18} />}>
                <div className="grid grid-cols-2 gap-2">
                  <Toggle active={s.links} onClick={() => update({ links: !s.links })} icon={<Link2 size={17} />}>
                    הדגשת קישורים
                  </Toggle>
                  <Toggle active={s.headings} onClick={() => update({ headings: !s.headings })} icon={<Heading size={17} />}>
                    הדגשת כותרות
                  </Toggle>
                  <Toggle active={s.readable} onClick={() => update({ readable: !s.readable })} icon={<Type size={17} />}>
                    פונט קריא
                  </Toggle>
                  <Toggle active={s.guide} onClick={() => update({ guide: !s.guide })} icon={<AlignJustify size={17} />}>
                    מדריך קריאה
                  </Toggle>
                </div>
              </Group>

              {/* תנועה וסמן */}
              <Group title="תנועה וסמן" icon={<MousePointer2 size={18} />}>
                <div className="grid grid-cols-2 gap-2">
                  <Toggle active={s.stop} onClick={() => update({ stop: !s.stop })} icon={<PauseCircle size={17} />}>
                    עצירת אנימציות
                  </Toggle>
                  <Toggle active={s.bigCursor} onClick={() => update({ bigCursor: !s.bigCursor })} icon={<MousePointer2 size={17} />}>
                    סמן גדול
                  </Toggle>
                </div>
              </Group>

              {/* איפוס */}
              <button
                onClick={reset}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-black/15 py-3 text-[15px] font-bold text-[#111] transition-colors hover:bg-black/5"
              >
                <RotateCcw size={17} /> איפוס הגדרות
              </button>
            </div>

            {/* תחתית — הצהרת נגישות */}
            <div className="border-t border-black/10 p-4">
              <Link
                href="/accessibility"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1a56db] py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
              >
                <FileText size={17} /> הצהרת נגישות
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function Group({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#555]">
        {icon} {title}
      </h3>
      {children}
    </section>
  )
}

function Toggle({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-2 text-center text-[13px] font-semibold leading-tight transition-colors ${
        active
          ? 'border-[#1a56db] bg-[#1a56db]/10 text-[#1a56db]'
          : 'border-black/12 text-[#222] hover:border-black/30'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function ConBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-black/12 text-[#222] transition-colors hover:border-[#1a56db] hover:text-[#1a56db] disabled:opacity-40"
    >
      {children}
    </button>
  )
}
