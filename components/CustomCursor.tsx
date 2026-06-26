'use client'

// ============================================================
// components/CustomCursor.tsx — סמן עכבר מותאם, אלגנטי:
// נקודה כתומה מדויקת + טבעת שמשתרכת אחריה, מתרחבת מעל אלמנטים
// אינטראקטיביים. דסקטופ בלבד. מכבה את עצמו אוטומטית כשבתפריט
// הנגישות מפעילים "סמן גדול" / "עצירת אנימציות" / reduce-motion.
// ============================================================

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  // האם בכלל להפעיל (דסקטופ; reduce-motion רק מבטל את ההשתרכות, לא את הסמן)
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

    // אם המערכת מבקשת צמצום תנועה — הטבעת עוקבת מיידית (בלי השתרכות)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lag = reduce ? 1 : 0.18

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
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`
      // הגדלת הטבעת מעל אלמנטים אינטראקטיביים
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
        className="pointer-events-none fixed left-0 top-0 z-[140] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          marginLeft: '-4px',
          marginTop: '-4px',
          background: 'var(--accent)',
          transition: 'opacity .3s',
        }}
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
        .ccursor-ring{
          width:34px;height:34px;margin-left:-17px;margin-top:-17px;
          border:1.5px solid var(--accent);
          transition:width .25s ease, height .25s ease, margin .25s ease, background-color .25s ease, opacity .3s ease;
        }
        .ccursor-ring[data-hot="1"]{
          width:56px;height:56px;margin-left:-28px;margin-top:-28px;
          background:rgba(255,104,44,0.12);
        }
        .ccursor-ring[data-down="1"]{ transform-origin:center; }
      `}</style>
    </>
  )
}
