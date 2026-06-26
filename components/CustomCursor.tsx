'use client'

// ============================================================
// components/CustomCursor.tsx — סמן עכבר מותאם בנושא "מצלמה":
// מסגרת-פוקוס (focus reticle) של 4 פינות, כמו מסגרת מיקוד במצלמה,
// ובמרכזה נקודה כתומה. בתנועה המסגרת "מחפשת פוקוס" (נפתחת מעט),
// ומעל אלמנט אינטראקטיבי היא "נועלת פוקוס" (מתכווצת ומתבהרת).
// "משחק" הנקודה: לפי מיקום העכבר על המסך הנקודה נוטה לכיוון ההפוך,
// חזק יותר בקצוות. דסקטופ בלבד; מכבה את עצמו ב"סמן גדול"/"עצירת
// אנימציות" בתפריט הנגישות.
// ============================================================

import { useEffect, useRef, useState } from 'react'

const LEAN_X = 9
const LEAN_Y = 6

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
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
    let open = 0 // פתיחת המסגרת בתנועה (חיפוש פוקוס)

    function onMove(e: MouseEvent) {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        visible = true
        if (dot.current) dot.current.style.opacity = '1'
        if (frame.current) frame.current.style.opacity = '1'
      }
      const t = e.target as HTMLElement
      const interactive = t.closest('a, button, [role="button"], input, textarea, label, select, [data-cursor]')
      if (frame.current) frame.current.dataset.hot = interactive ? '1' : '0'
    }
    function onDown() {
      if (frame.current) frame.current.dataset.down = '1'
    }
    function onUp() {
      if (frame.current) frame.current.dataset.down = '0'
    }
    function onLeave() {
      visible = false
      if (dot.current) dot.current.style.opacity = '0'
      if (frame.current) frame.current.style.opacity = '0'
    }

    function loop() {
      const px = rx
      const py = ry
      rx += (mx - rx) * lag
      ry += (my - ry) * lag

      // המסגרת "נפתחת" לפי המהירות (חיפוש פוקוס), ונסגרת במנוחה
      const speed = Math.hypot(rx - px, ry - py)
      const target = Math.min(speed * 0.02, 0.32)
      open += (target - open) * 0.15
      const hot = frame.current?.dataset.hot === '1'
      const down = frame.current?.dataset.down === '1'
      const base = hot ? 0.66 : 1
      const scale = base * (down ? 0.85 : 1) * (1 + open)
      if (frame.current) {
        frame.current.style.transform = `translate(${rx}px, ${ry}px) scale(${scale.toFixed(3)})`
      }

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
      {/* נקודת מרכז */}
      <div
        ref={dot}
        aria-hidden
        className="ccursor-dot pointer-events-none fixed left-0 top-0 z-[140] rounded-full opacity-0"
      />
      {/* מסגרת-פוקוס: 4 פינות */}
      <div
        ref={frame}
        aria-hidden
        data-hot="0"
        data-down="0"
        className="ccursor-frame pointer-events-none fixed left-0 top-0 z-[140] opacity-0"
      >
        <span className="cc-corner cc-tl" />
        <span className="cc-corner cc-tr" />
        <span className="cc-corner cc-bl" />
        <span className="cc-corner cc-br" />
      </div>
      <style>{`
        .ccursor-dot{
          width:6px;height:6px;margin-left:-3px;margin-top:-3px;
          background:var(--accent);
          box-shadow:0 0 9px rgba(255,104,44,0.75);
          transition:opacity .3s ease;
        }
        .ccursor-frame{
          width:40px;height:40px;margin-left:-20px;margin-top:-20px;
          transition:opacity .3s ease;
          filter:drop-shadow(0 0 5px rgba(255,104,44,0.35));
        }
        .cc-corner{
          position:absolute;width:10px;height:10px;
          border-color:color-mix(in srgb, var(--accent) 85%, transparent);
          transition:border-color .25s ease;
        }
        .cc-tl{top:0;left:0;border-top:2px solid;border-left:2px solid;border-top-left-radius:3px}
        .cc-tr{top:0;right:0;border-top:2px solid;border-right:2px solid;border-top-right-radius:3px}
        .cc-bl{bottom:0;left:0;border-bottom:2px solid;border-left:2px solid;border-bottom-left-radius:3px}
        .cc-br{bottom:0;right:0;border-bottom:2px solid;border-right:2px solid;border-bottom-right-radius:3px}
        .ccursor-frame[data-hot="1"] .cc-corner{
          border-color:var(--accent);
        }
        .ccursor-frame[data-hot="1"]::after{
          content:'';position:absolute;inset:7px;border-radius:7px;
          background:rgba(255,104,44,0.10);
        }
      `}</style>
    </>
  )
}
