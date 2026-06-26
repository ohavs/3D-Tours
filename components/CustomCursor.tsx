'use client'

// ============================================================
// components/CustomCursor.tsx — סמן עכבר מותאם, מעודן:
// טבעת דקה עם זוהר רך, ועליה שתי קשתות-אקסנט כתומות שמסתובבות
// כל הזמן (תחושת עדשה/פוקוס, מתכתב עם 360°). במרכז נקודה כתומה.
// מעל אלמנט אינטראקטיבי הטבעת גדלה והסיבוב מאיץ. "משחק" הנקודה:
// לפי מיקום העכבר על המסך היא נוטה לכיוון ההפוך, חזק יותר בקצוות.
// דסקטופ בלבד; מכבה את עצמו ב"סמן גדול"/"עצירת אנימציות".
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
    let open = 0

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

      const speed = Math.hypot(rx - px, ry - py)
      open += (Math.min(speed * 0.014, 0.22) - open) * 0.15
      const hot = frame.current?.dataset.hot === '1'
      const down = frame.current?.dataset.down === '1'
      const scale = (hot ? 1.45 : 1) * (down ? 0.86 : 1) * (1 + open)
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
      {/* טבעת עם קשתות מסתובבות */}
      <div
        ref={frame}
        aria-hidden
        data-hot="0"
        data-down="0"
        className="ccursor-ring pointer-events-none fixed left-0 top-0 z-[140] opacity-0"
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle className="cc-base" cx="20" cy="20" r="18" fill="none" strokeWidth="1.25" />
          <circle
            className="cc-arc"
            cx="20"
            cy="20"
            r="18"
            fill="none"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="16 40.5 16 40.5"
          />
        </svg>
      </div>
      <style>{`
        .ccursor-dot{
          width:6px;height:6px;margin-left:-3px;margin-top:-3px;
          background:var(--accent);
          box-shadow:0 0 10px rgba(255,104,44,0.8);
          transition:opacity .3s ease;
        }
        .ccursor-ring{
          width:40px;height:40px;margin-left:-20px;margin-top:-20px;
          transition:opacity .3s ease;
          filter:drop-shadow(0 0 6px rgba(255,104,44,0.35));
        }
        .ccursor-ring svg{display:block}
        .cc-base{ stroke:color-mix(in srgb, var(--accent) 26%, transparent); }
        .cc-arc{
          stroke:var(--accent);
          transform-box:fill-box; transform-origin:center;
          animation:ccspin 2.8s linear infinite;
        }
        .ccursor-ring[data-hot="1"] .cc-arc{ animation-duration:1.1s; }
        .ccursor-ring[data-hot="1"] .cc-base{ stroke:color-mix(in srgb, var(--accent) 42%, transparent); }
        @keyframes ccspin{ to{ transform:rotate(360deg); } }
      `}</style>
    </>
  )
}
