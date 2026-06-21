'use client'

// ============================================================
// components/PannellumViewer.tsx
// הקומפוננטה שמציגה את הסיור 360°.
//
// למה 'use client' בראש הקובץ?
//   Pannellum היא ספריית JavaScript שרצה בדפדפן בלבד — היא משתמשת
//   ב-window וב-DOM. ב-Next.js, ברירת המחדל היא שקומפוננטות רצות
//   קודם בשרת (שם אין window). 'use client' אומר ל-Next: "את
//   הקומפוננטה הזו תריץ רק בדפדפן". כך אין שגיאות.
//
// למה טוענים את Pannellum מ-CDN ולא מ-npm?
//   Pannellum לא מתוחזק כחבילת npm נוחה, ולכן הדרך המומלצת היא
//   לטעון את קובץ ה-JS וה-CSS שלה ישירות מהאינטרנט (CDN), פעם אחת.
// ============================================================

import { useEffect, useRef } from 'react'
import type { ViewerScene } from '@/lib/types'

// כתובות הספרייה ב-CDN (גרסה נעולה כדי שלא תשתנה מתחתינו)
const PANNELLUM_JS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'

// מצהירים ל-TypeScript ש-window.pannellum קיים (הוא נטען מ-CDN בזמן ריצה)
declare global {
  interface Window {
    pannellum?: {
      viewer: (el: HTMLElement | string, config: unknown) => PannellumInstance
    }
  }
}

interface PannellumInstance {
  destroy: () => void
}

// --- טעינת הספרייה מ-CDN, פעם אחת בלבד לכל הדף ---
// אנחנו שומרים "הבטחה" (Promise) ברמת המודול, כך שגם אם כמה viewers
// נטענים יחד, הספרייה תורד רק פעם אחת.
let pannellumLoader: Promise<void> | null = null

function loadPannellum(): Promise<void> {
  // אם כבר נטען בעבר — מחזירים את אותה ההבטחה
  if (pannellumLoader) return pannellumLoader

  pannellumLoader = new Promise<void>((resolve, reject) => {
    // אם איכשהו כבר קיים — סיימנו
    if (window.pannellum) {
      resolve()
      return
    }

    // 1) טוענים את ה-CSS (העיצוב של הViewer)
    if (!document.querySelector(`link[href="${PANNELLUM_CSS}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = PANNELLUM_CSS
      document.head.appendChild(link)
    }

    // 2) טוענים את ה-JS (הקוד של הViewer)
    const script = document.createElement('script')
    script.src = PANNELLUM_JS
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('נכשלה טעינת Pannellum מה-CDN'))
    document.body.appendChild(script)
  })

  return pannellumLoader
}

// --- ה-props (הקלט) שהקומפוננטה מקבלת ---
interface PannellumViewerProps {
  scenes: ViewerScene[] // רשימת החדרים (סצנות)
  firstSceneId: string // איזה חדר להציג ראשון
  className?: string // עיצוב נוסף אופציונלי
}

export default function PannellumViewer({
  scenes,
  firstSceneId,
  className,
}: PannellumViewerProps) {
  // ref = "מצביע" לאלמנט ה-div שבתוכו Pannellum יצייר את הסיור
  const containerRef = useRef<HTMLDivElement>(null)
  // שומרים את מופע ה-viewer כדי שנוכל להרוס אותו כשהקומפוננטה נעלמת
  const viewerRef = useRef<PannellumInstance | null>(null)

  useEffect(() => {
    let cancelled = false

    loadPannellum()
      .then(() => {
        // אם הקומפוננטה כבר נעלמה בינתיים — לא ממשיכים
        if (cancelled || !containerRef.current || !window.pannellum) return

        // ממירים את הסצנות שלנו לפורמט ש-Pannellum מבין
        const pannellumScenes: Record<string, unknown> = {}
        for (const scene of scenes) {
          pannellumScenes[scene.id] = {
            type: 'equirectangular',
            panorama: scene.panorama,
            title: scene.title,
            autoLoad: true,
            hotSpots: (scene.hotSpots ?? []).map((h) => ({
              pitch: h.pitch,
              yaw: h.yaw,
              type: 'scene', // hotspot שמעביר לסצנה אחרת
              text: h.text,
              sceneId: h.targetSceneId,
            })),
          }
        }

        // יוצרים את ה-viewer בתוך ה-div
        viewerRef.current = window.pannellum.viewer(containerRef.current, {
          default: {
            firstScene: firstSceneId,
            sceneFadeDuration: 1000, // מעבר חלק בין חדרים (1 שנייה)
            autoLoad: true, // טען מיד, בלי כפתור "הפעל"
          },
          scenes: pannellumScenes,
        })
      })
      .catch((err) => {
        console.error(err)
      })

    // פונקציית ניקוי: רצה כשהקומפוננטה נעלמת מהמסך
    return () => {
      cancelled = true
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [scenes, firstSceneId])

  return (
    <div
      ref={containerRef}
      className={className}
      // Pannellum חייב מיכל עם גובה מפורש כדי לצייר בתוכו
      style={{ width: '100%', height: '100%' }}
    />
  )
}
