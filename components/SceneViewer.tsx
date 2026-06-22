'use client'

// ============================================================
// components/SceneViewer.tsx — מציג סיור מהמסד: כל החדרים, עם רצועת
// תמונות ממוזערות (gallery) למעבר ביניהם. נקודות ניווט בתוך החדר
// יתווספו בשלב העורך הבא.
// ============================================================

import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/gallery-plugin/index.css'

import { useEffect, useRef, useState } from 'react'
import type { Viewer as PSViewer } from '@photo-sphere-viewer/core'
import { Spinner } from '@/components/anim'
import type { TourScene } from '@/lib/types'

export default function SceneViewer({ scenes }: { scenes: TourScene[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (scenes.length === 0) return
    let viewer: PSViewer | null = null
    let cancelled = false

    ;(async () => {
      const [{ Viewer }, { GalleryPlugin }] = await Promise.all([
        import('@photo-sphere-viewer/core'),
        import('@photo-sphere-viewer/gallery-plugin'),
      ])
      if (cancelled || !containerRef.current) return

      viewer = new Viewer({
        container: containerRef.current,
        panorama: scenes[0].image_url,
        caption: scenes[0].title,
        navbar: ['zoom', 'caption', 'gallery', 'fullscreen'],
        plugins: [[GalleryPlugin, { visibleOnLoad: scenes.length > 1 }]],
      })

      const gallery = viewer.getPlugin(GalleryPlugin) as unknown as {
        setItems: (items: unknown[]) => void
      } | null
      gallery?.setItems(
        scenes.map((s) => ({
          id: s.id,
          name: s.title,
          panorama: s.image_url,
          thumbnail: s.image_url,
          options: { caption: s.title },
        })),
      )

      viewer.addEventListener('ready', () => {
        if (!cancelled) setLoading(false)
      })
    })()

    return () => {
      cancelled = true
      viewer?.destroy()
    }
  }, [scenes])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-mist">
          <Spinner className="h-8 w-8" />
          <span className="text-caption text-graphite">טוען סיור…</span>
        </div>
      )}
    </div>
  )
}
