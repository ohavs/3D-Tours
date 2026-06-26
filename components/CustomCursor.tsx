'use client'

// ============================================================
// components/CustomCursor.tsx — סמן עכבר מותאם, מעוצב:
// טבעת מלוטשת עם זוהר רך שמשתרכת אחרי העכבר, ובתוכה נקודה כתומה.
// "משחק" הנקודה: לפי מיקום העכבר על המסך הנקודה נוטה לכיוון ההפוך —
// בחצי השמאלי היא נדחפת ימינה, בחצי הימני שמאלה, וככל שהעכבר קרוב
// יותר לקצה — כך הנטייה חזקה יותר. דסקטופ בלבד. מכבה את עצמו
// כשבתפריט הנגישות מפעילים "סמן גדול" / "עצירת אנימציות".
// ============================================================

import { useEffect, useRef, useState } from 'react'

// עוצמת נטיית הנקודה בתוך הטבעת (px) — נשארת בתוך הטבעת בבטחה.
const LEAN_X = 9
const LEAN_Y = 6

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    function readA11y() {
      const raw = localStorage.getItem('a11y-settings')
      if (!raw) return { bigCursor: false, stop: false }
      try {
        const s = JSON.parse(raw)
        return { bigCursor: !!s.bigCursor, stop: !!s.stop }
      } catch {
        return { bigCursor: false, stop: false }
      }
    }
    const init = readA11y()
    setEnabled(!init.bigCursor && !init.stop)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onA11y(e: any) {
      const d = e.detail || {}
      setEnabled(!d.bigCursor && !d.stop)
    }
    window.addEventListener('a11y-change', onA11y)
    return () => window.removeEventListener('a11y-change', onA11y)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if (!enabled) {
      html.classList.remove('cursor-hidden')
      return
    }
    html.classList.add('cursor-hidden')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lag = reduce ? 1 : 0.2

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0
    let visible = false

    function onMove(e: MouseEvent) {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        visible = true
        if (dot.current) dot.current.style.opacity = '1'
        if (ring.current) ring.current.style.opacity = '1'
      }
      const t = e.target as HTMLElement
      const interactive = t.closest('a, button, [role="button"], input, textarea, label, select, [data-cursor]')
      if (ring.current) ring.current.dataset.hot = interactive ? '1' : '0'
    }
    function onDown() {
      if (ring.current) ring.current.dataset.down = '1'
    }
    function onUp() {
      if (ring.current) ring.current.dataset.down = '0'
    }
    function onLeave() {
      visible = false
      if (dot.current) dot.current.style.opacity = '0'
      if (ring.current) ring.current.style.opacity = '0'
    }

    function loop() {
      rx += (mx - rx) * lag
      ry += (my - ry) * lag
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      // נטיית הנקודה: לפי מיקום על המסך, לכיוון ההפוך, חזק יותר בקצוות
      const nx = Math.max(-1, Math.min(1, (mx / window.innerWidth - 0.5) * 2))
      const ny = Math.max(-1, Math.min(1, (my / window.innerHeight - 0.5) * 2))
      const lx = -nx * LEAN_X
      const ly = -ny * LEAN_Y
      if (dot.current) dot.current.style.transform = `translate(${rx + lx}px, ${ry + ly}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      html.classList.remove('cursor-hidden')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* נקודה */}
      <div
        ref={dot}
        aria-hidden
        className="ccursor-dot pointer-events-none fixed left-0 top-0 z-[140] rounded-full opacity-0"
      />
      {/* טבעת */}
      <div
        ref={ring}
        aria-hidden
        data-hot="0"
        data-down="0"
        className="ccursor-ring pointer-events-none fixed left-0 top-0 z-[140] rounded-full opacity-0"
      />
      <style>{`
        .ccursor-dot{
          width:7px;height:7px;margin-left:-3.5px;margin-top:-3.5px;
          background:var(--accent);
          box-shadow:0 0 8px rgba(255,104,44,0.7);
          transition:opacity .3s ease, width .2s ease, height .2s ease;
        }
        .ccursor-ring{
          width:36px;height:36px;margin-left:-18px;margin-top:-18px;
          border:1.5px solid color-mix(in srgb, var(--accent) 70%, transparent);
          box-shadow:0 0 18px rgba(255,104,44,0.22), inset 0 0 10px rgba(255,104,44,0.06);
          transition:width .28s cubic-bezier(.22,1,.36,1), height .28s cubic-bezier(.22,1,.36,1),
                     margin .28s cubic-bezier(.22,1,.36,1), border-color .28s ease,
                     background-color .28s ease, opacity .3s ease;
        }
        .ccursor-ring[data-hot="1"]{
          width:62px;height:62px;margin-left:-31px;margin-top:-31px;
          border-color:color-mix(in srgb, var(--accent) 90%, transparent);
          background:rgba(255,104,44,0.10);
        }
        .ccursor-ring[data-down="1"]{
          width:28px;height:28px;margin-left:-14px;margin-top:-14px;
          background:rgba(255,104,44,0.16);
        }
      `}</style>
    </>
  )
}
