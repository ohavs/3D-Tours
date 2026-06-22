'use client'

// ============================================================
// components/SceneViewer.tsx — מציג סיור מהמסד: כל החדרים, עם רצועת
// תמונות ממוזערות (gallery) למעבר ביניהם ו-hotspots לניווט ישיר.
// ============================================================

import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/gallery-plugin/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'

import { useEffect, useRef, useState } from 'react'
import type { Viewer as PSViewer } from '@photo-sphere-viewer/core'
import { Spinner } from '@/components/anim'
import type { TourScene } from '@/lib/types'

// arrow marker SVG for hotspots in the public viewer
function arrowSvg(label: string) {
  const escaped = label.replace(/[<>&"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c),
  )
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
  <circle cx="28" cy="28" r="26" fill="rgba(255,104,44,0.88)" stroke="white" stroke-width="2.5"/>
  <text x="28" y="22" font-family="system-ui,sans-serif" font-size="16" fill="white"
    text-anchor="middle" dominant-baseline="middle">→</text>
  <text x="28" y="38" font-family="system-ui,sans-serif" font-size="10" font-weight="600"
    fill="white" text-anchor="middle" dominant-baseline="middle">${escaped}</text>
</svg>`
}

export default function SceneViewer({ scenes }: { scenes: TourScene[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const viewerRef = useRef<PSViewer | null>(null)
  const markersPluginRef = useRef<{ clearMarkers: () => void; addMarker: (m: unknown) => void } | null>(null)
  const galleryPluginRef = useRef<{ setItems: (items: unknown[]) => void } | null>(null)
  const currentSceneRef = useRef<TourScene | null>(null)

  const transitioningRef = useRef(false)

  function renderHotspots(scene: TourScene) {
    const mp = markersPluginRef.current
    if (!mp) return
    mp.clearMarkers()
    const hs = scene.hotspots ?? []
    hs.forEach((h) => {
      const dest = scenes.find((s) => s.id === h.target_scene_id)
      mp.addMarker({
        id: `hs-${h.id}`,
        position: { pitch: h.pitch, yaw: h.yaw },
        html: arrowSvg(h.text),
        size: { width: 56, height: 56 },
        anchor: 'center',
        tooltip: dest ? `עבור אל: ${dest.title}` : h.text,
        // שומרים את כיוון הנקודה כדי "לצעוד" לכיוונה במעבר
        data: { targetSceneId: h.target_scene_id, yaw: h.yaw, pitch: h.pitch },
      })
    })
  }

  // מעבר בסגנון Street View: מזמינים את המצלמה לתוך הנקודה (zoom-in
  // לכיוון התנועה) ואז מבצעים crossfade לחדר הבא תוך משיכת הזום החוצה —
  // כך נוצרת תחושת "המשכיות" ולא פשוט fade-out / fade-in.
  async function navigateTo(target: TourScene, yaw: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewer = viewerRef.current as any
    if (!viewer || transitioningRef.current) return
    transitioningRef.current = true
    try {
      // 1) "צעד קדימה" — מסתובבים לכיוון הנקודה ומתקרבים
      await viewer.animate({ yaw, pitch: 0, zoom: 72, speed: 450 })
      // 2) crossfade לחדר הבא, מתחילים מעט מקורבים וחוזרים לזום רגיל
      await viewer.setPanorama(target.image_url, {
        caption: target.title,
        position: { yaw, pitch: 0 },
        zoom: 50,
        transition: { effect: 'fade', rotation: false, speed: 900 },
        showLoader: true,
      })
      currentSceneRef.current = target
      renderHotspots(target)
    } finally {
      transitioningRef.current = false
    }
  }

  useEffect(() => {
    if (scenes.length === 0) return
    let cancelled = false

    ;(async () => {
      const [{ Viewer }, { GalleryPlugin }, { MarkersPlugin }] = await Promise.all([
        import('@photo-sphere-viewer/core'),
        import('@photo-sphere-viewer/gallery-plugin'),
        import('@photo-sphere-viewer/markers-plugin'),
      ])
      if (cancelled || !containerRef.current) return

      const viewer = new Viewer({
        container: containerRef.current,
        panorama: scenes[0].image_url,
        caption: scenes[0].title,
        navbar: ['zoom', 'caption', 'gallery', 'fullscreen'],
        plugins: [
          [GalleryPlugin, { visibleOnLoad: scenes.length > 1 }],
          [MarkersPlugin, {}],
        ],
      })

      viewerRef.current = viewer

      const gallery = viewer.getPlugin(GalleryPlugin) as unknown as {
        setItems: (items: unknown[]) => void
      } | null
      galleryPluginRef.current = gallery as typeof galleryPluginRef.current

      gallery?.setItems(
        scenes.map((s) => ({
          id: s.id,
          name: s.title,
          panorama: s.image_url,
          thumbnail: s.image_url,
          options: { caption: s.title },
        })),
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markers = viewer.getPlugin(MarkersPlugin) as any
      markersPluginRef.current = markers as typeof markersPluginRef.current

      viewer.addEventListener('ready', () => {
        if (cancelled) return
        setLoading(false)
        currentSceneRef.current = scenes[0]
        renderHotspots(scenes[0])
      })

      // when the gallery switches panorama, update hotspots
      viewer.addEventListener('panorama-loaded', () => {
        if (cancelled) return
        // find which scene matches current panorama
        const current = (viewer as unknown as { config: { panorama: string } }).config?.panorama
        const scene = scenes.find((s) => s.image_url === current)
        if (scene) {
          currentSceneRef.current = scene
          renderHotspots(scene)
        }
      })

      // hotspot click → "step" into the target scene (Street View feel)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      markers?.addEventListener('select-marker', (e: any) => {
        const data = e.marker.data
        if (!data?.targetSceneId) return
        const target = scenes.find((s) => s.id === data.targetSceneId)
        if (!target) return
        navigateTo(target, data.yaw ?? 0)
      })
    })()

    return () => {
      cancelled = true
      viewerRef.current?.destroy()
      viewerRef.current = null
      markersPluginRef.current = null
      galleryPluginRef.current = null
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
