'use client'

// ============================================================
// components/interactive.tsx — מיקרו-אינטראקציות שנותנות לאתר תחושה
// חיה ומגיבה:
//   ReactiveText  — "צביעת אותיות" לפי קרבת הסמן (לא hover בינארי)
//   Magnetic      — אלמנט שנמשך בעדינות אל הסמן
//   CursorGlow    — זוהר כתום רך שעוקב אחרי הסמן (דסקטופ בלבד)
//   ScrollThemeFlip — מחליף Light/Dark בזמן גלילה, עם מעבר חלק
// ============================================================

import {
  useEffect,
  useRef,
  type ReactNode,
  type ElementType,
} from 'react'

// ---------- ReactiveText: צביעת אותיות לפי קרבת הסמן ----------
export function ReactiveText({
  text,
  as: Tag = 'span',
  className,
  radius = 95,
  lift = 5,
}: {
  text: string
  as?: ElementType
  className?: string
  radius?: number
  lift?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const raf = useRef(0)

  function paint(clientX: number, clientY: number) {
    const root = ref.current
    if (!root) return
    const chars = root.querySelectorAll<HTMLElement>('[data-rt]')
    chars.forEach((c) => {
      const r = c.getBoundingClientRect()
      const d = Math.hypot(clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2))
      const t = Math.max(0, 1 - d / radius)
      if (t > 0) {
        c.style.color = `color-mix(in srgb, var(--accent) ${Math.round(t * 100)}%, var(--foreground))`
        c.style.transform = `translateY(${(-t * lift).toFixed(2)}px)`
      } else if (c.style.color) {
        c.style.color = ''
        c.style.transform = ''
      }
    })
  }

  function onMove(e: React.PointerEvent) {
    const { clientX, clientY } = e
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => paint(clientX, clientY))
  }
  function onLeave() {
    cancelAnimationFrame(raf.current)
    const root = ref.current
    root?.querySelectorAll<HTMLElement>('[data-rt]').forEach((c) => {
      c.style.color = ''
      c.style.transform = ''
    })
  }

  const lines = text.split('\n')
  return (
    <Tag
      ref={ref as never}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {Array.from(line).map((ch, i) => (
            <span
              key={i}
              data-rt
              style={{
                display: 'inline-block',
                transition: 'color .12s ease, transform .18s cubic-bezier(0.22,1,0.36,1)',
                willChange: 'color, transform',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

// ---------- Magnetic: אלמנט שנמשך אל הסמן ----------
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  function onMove(e: React.PointerEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-block ${className ?? ''}`}
      style={{ transition: 'transform .35s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
    >
      {children}
    </span>
  )
}

// ---------- CursorGlow: זוהר כתום שעוקב אחרי הסמן ----------
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let raf = 0
    function move(e: MouseEvent) {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
          ref.current.style.opacity = '1'
        }
      })
    }
    function leave() {
      if (ref.current) ref.current.style.opacity = '0'
    }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[420px] w-[420px] opacity-0 transition-opacity duration-500"
      style={{
        marginLeft: '-210px',
        marginTop: '-210px',
        background: 'radial-gradient(circle, rgba(255,104,44,0.10), transparent 60%)',
      }}
    />
  )
}

// ---------- ScrollModes: החלפת Light/Dark מתחלפת לאורך הסקשנים ----------
// כל סקשן עם data-mode="dark"/"light" קובע את המצב כשהוא במרכז המסך,
// כך שבירידה דרך האמצע המצבים מתחלפים; כשאין סקשן כזה (כמו "צור קשר")
// חוזרים למצב הבסיסי שבו המשתמש התחיל. עובד בשני הכיוונים.
// משנים class ישירות (לא next-themes) כדי לא ללכלך את ההעדפה השמורה.
export function ScrollModes() {
  useEffect(() => {
    const html = document.documentElement
    const baseDark = html.classList.contains('dark')
    const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-mode]'))
    if (!zones.length) return
    const active = new Set<HTMLElement>()
    let timer: ReturnType<typeof setTimeout> | null = null

    function applyDark(dark: boolean) {
      if (html.classList.contains('dark') === dark) return
      html.classList.add('theme-flip')
      html.classList.toggle('dark', dark)
      html.classList.toggle('light', !dark)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => html.classList.remove('theme-flip'), 650)
    }
    function recompute() {
      let chosen: HTMLElement | null = null
      for (const z of zones) {
        if (active.has(z)) {
          chosen = z
          break
        }
      }
      applyDark(chosen ? chosen.dataset.mode === 'dark' : baseDark)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) active.add(e.target as HTMLElement)
          else active.delete(e.target as HTMLElement)
        }
        recompute()
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    zones.forEach((z) => obs.observe(z))
    return () => {
      obs.disconnect()
      if (timer) clearTimeout(timer)
      html.classList.toggle('dark', baseDark)
      html.classList.toggle('light', !baseDark)
    }
  }, [])
  return null
}
