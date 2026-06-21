'use client'

// ============================================================
// components/TourViewer.tsx
// ה-Viewer של הסיור — מבוסס Photo Sphere Viewer + VirtualTourPlugin.
//
// למה החלפנו את Pannellum?
//   Pannellum רק "מחליף תמונה" בין סצנות. כאן, ה-VirtualTourPlugin
//   מציב חצים על הרצפה לפי מיקום (GPS) של הנקודות השכנות, ועושה
//   מעבר חלק של "התקדמות קדימה" אל הנקודה הבאה — תחושת טיול אמיתית.
//
// 'use client' — הספרייה רצה בדפדפן בלבד (משתמשת ב-window/WebGL).
// את קוד ה-JS טוענים דינמית בתוך useEffect כדי שלא ירוץ בשרת.
// ============================================================

import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/virtual-tour-plugin/index.css'

import { useEffect, useRef, useState } from 'react'
import type { TourNode } from '@/lib/types'
import type { Viewer as PSViewer } from '@photo-sphere-viewer/core'
import type { VirtualTourNode } from '@photo-sphere-viewer/virtual-tour-plugin'
import { Spinner } from '@/components/anim'

interface TourViewerProps {
  nodes: TourNode[]
  startNodeId: string
}

export default function TourViewer({ nodes, startNodeId }: TourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let viewer: PSViewer | null = null
    let cancelled = false

    ;(async () => {
      // טעינה דינמית (בדפדפן בלבד)
      const [{ Viewer }, { VirtualTourPlugin }] = await Promise.all([
        import('@photo-sphere-viewer/core'),
        import('@photo-sphere-viewer/virtual-tour-plugin'),
      ])
      if (cancelled || !containerRef.current) return

      viewer = new Viewer({
        container: containerRef.current,
        defaultYaw: '130deg',
        navbar: ['zoom', 'move', 'caption', 'fullscreen'],
        plugins: [
          VirtualTourPlugin.withConfig({
            positionMode: 'gps', // מיקום הנקודות לפי קואורדינטות
            renderMode: '2d', // נקודות שטוחות וזקופות (קל יותר לזהות)
            // caption = שם הנקודה, כדי שייראה בפס התחתון ויתחלף בכל מעבר
            nodes: nodes.map((n) => ({
              ...n,
              caption: n.name,
            })) as unknown as VirtualTourNode[],
            startNodeId,
          }),
        ],
      })

      // מסתירים את הלואדר כשהפנורמה הראשונה מוכנה
      viewer.addEventListener('ready', () => {
        if (!cancelled) setLoading(false)
      })
    })()

    return () => {
      cancelled = true
      viewer?.destroy()
    }
  }, [nodes, startNodeId])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* לואדר עד שהפנורמה הראשונה נטענת */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-mist">
          <Spinner className="h-8 w-8" />
          <span className="text-caption text-graphite">טוען סיור…</span>
        </div>
      )}
    </div>
  )
}
