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

import { useEffect, useRef } from 'react'
import type { TourNode } from '@/lib/types'
import type { VirtualTourNode } from '@photo-sphere-viewer/virtual-tour-plugin'

interface TourViewerProps {
  nodes: TourNode[]
  startNodeId: string
}

export default function TourViewer({ nodes, startNodeId }: TourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let viewer: { destroy: () => void } | null = null
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
        navbar: ['zoom', 'move', 'fullscreen'],
        plugins: [
          VirtualTourPlugin.withConfig({
            positionMode: 'gps', // מיקום החצים לפי קואורדינטות
            renderMode: '3d', // חצים על הרצפה + מעבר "צעידה" חלק
            nodes: nodes as unknown as VirtualTourNode[],
            startNodeId,
          }),
        ],
      })
    })()

    return () => {
      cancelled = true
      viewer?.destroy()
    }
  }, [nodes, startNodeId])

  return <div ref={containerRef} className="h-full w-full" />
}
