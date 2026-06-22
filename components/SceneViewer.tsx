'use client'

// ============================================================
// components/SceneViewer.tsx — נגן הסיור (מהמסד).
// UI מותאם אישית במלואו: בקרות נקיות, רצועת חדרים נסתרת שנפתחת
// בריחוף (דסקטופ) או בלחיצה (מובייל), נקודות ניווט, מעבר "צעידה"
// בין חדרים, וטיפול שגיאות מעוצב בעברית.
// ============================================================

import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'

import { useEffect, useRef, useState } from 'react'
import type { Viewer as PSViewer } from '@photo-sphere-viewer/core'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import type { TourScene } from '@/lib/types'

// חץ ניווט (hotspot) — עיגול כתום עם חץ (בלי <title> כדי לא ליצור
// tooltip כפול של הדפדפן; ה-tooltip המעוצב מגיע מ-PSV)
function arrowSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58">
  <circle cx="29" cy="29" r="25" fill="rgba(255,104,44,0.9)" stroke="white" stroke-width="2.5"/>
  <path d="M29 18 l9 11 h-6 v10 h-6 V29 h-6 z" fill="white"/>
</svg>`
}

function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
}

export default function SceneViewer({ scenes }: { scenes: TourScene[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<PSViewer | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersPluginRef = useRef<any>(null)
  const currentSceneRef = useRef<TourScene | null>(null)
  const transitioningRef = useRef(false)
  const prefetchedRef = useRef<Set<string>>(new Set())

  const [loading, setLoading] = useState(true)
  const [navigating, setNavigating] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [currentId, setCurrentId] = useState(scenes[0]?.id ?? '')
  const [railOpen, setRailOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [errorTarget, setErrorTarget] = useState<TourScene | null>(null)
  const [errorDetail, setErrorDetail] = useState('')

  useEffect(() => setIsMobile(isMobileDevice()), [])

  function renderHotspots(scene: TourScene) {
    const mp = markersPluginRef.current
    if (!mp) return
    mp.clearMarkers()
    ;(scene.hotspots ?? []).forEach((h) => {
      const dest = scenes.find((s) => s.id === h.target_scene_id)
      mp.addMarker({
        id: `hs-${h.id}`,
        position: { pitch: h.pitch, yaw: h.yaw },
        html: arrowSvg(),
        size: { width: 58, height: 58 },
        anchor: 'center',
        tooltip: dest ? dest.title : h.text,
        data: { targetSceneId: h.target_scene_id, yaw: h.yaw },
      })
    })
  }

  // טוען פנורמה עם ניסיונות חוזרים — מטפל ב"Failed to fetch" זמני
  // שקורה בחיבור אינטרנט חלש. הניסיון הראשון עם מעבר fade, החוזרים
  // בלי מעבר (קל יותר). backoff הולך וגדל בין הניסיונות.
  async function loadWithRetry(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewer: any,
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseOpts: any,
    attempts = 3,
  ) {
    let lastErr: unknown
    for (let i = 0; i < attempts; i++) {
      try {
        const opts = i === 0 ? baseOpts : { ...baseOpts, transition: false }
        await viewer.setPanorama(url, opts)
        return
      } catch (e) {
        lastErr = e
        console.error(`[tour] load attempt ${i + 1}/${attempts} failed:`, e)
        if (i < attempts - 1) {
          setRetrying(true)
          await new Promise((r) => setTimeout(r, 900 * (i + 1)))
        }
      }
    }
    throw lastErr
  }

  // מעבר בין חדרים.
  // directional=true (לחיצה על חץ): "צעד" קדימה — מסתובבים לכיוון הנקודה
  //   ומתקרבים, ואז crossfade. כך נשמרת תחושת הכיוון.
  // directional=false (בחירה מהתפריט): שומרים על כיוון המבט הנוכחי.
  async function navigateTo(
    target: TourScene,
    opts: { yaw?: number; directional?: boolean } = {},
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewer = viewerRef.current as any
    if (!viewer || transitioningRef.current) return
    if (target.id === currentSceneRef.current?.id) return
    transitioningRef.current = true
    setErrorTarget(null)
    setErrorDetail('')
    setRetrying(false)
    setNavigating(true)
    if (isMobileDevice()) setRailOpen(false)
    const yaw = opts.yaw ?? 0
    const mobile = isMobileDevice()
    const directional = !!opts.directional
    try {
      // zoom-in מקדים (דסקטופ + חץ) — best-effort, לא קריטי
      if (!mobile && directional) {
        try {
          await viewer.animate({ yaw, pitch: 0, zoom: 80, speed: 350 })
        } catch {
          /* לא קריטי */
        }
      }
      const loadOpts =
        !mobile && directional
          ? {
              caption: target.title,
              position: { yaw, pitch: 0 },
              zoom: 50,
              transition: { effect: 'fade', rotation: false, speed: 700 },
              showLoader: false,
            }
          : {
              caption: target.title,
              transition: { effect: 'fade', rotation: false, speed: 700 },
              showLoader: false,
              ...(directional ? { position: { yaw, pitch: 0 } } : {}),
            }
      await loadWithRetry(viewer, target.image_url, loadOpts)
      currentSceneRef.current = target
      setCurrentId(target.id)
      renderHotspots(target)
      prefetchNeighbors(target)
    } catch (e) {
      console.error('[tour] navigation failed:', e)
      setErrorDetail(e instanceof Error ? `${e.name}: ${e.message}` : String(e))
      setErrorTarget(target)
    } finally {
      transitioningRef.current = false
      setNavigating(false)
      setRetrying(false)
    }
  }

  // טעינה מוקדמת (ברקע) של החדרים שאליהם מובילות נקודות הניווט בחדר
  // הנוכחי — כך הם כבר נמצאים במטמון הדפדפן כשעוברים אליהם, גם בחיבור
  // חלש. מתעלמים מכשלים (זה אופציונלי).
  function prefetchNeighbors(scene: TourScene) {
    const targets = new Set(
      (scene.hotspots ?? []).map((h) => h.target_scene_id),
    )
    targets.forEach((id) => {
      const dest = scenes.find((s) => s.id === id)
      if (!dest || prefetchedRef.current.has(dest.image_url)) return
      prefetchedRef.current.add(dest.image_url)
      fetch(dest.image_url, { mode: 'cors', cache: 'force-cache' }).catch(() => {
        // נכשל? מסירים מהסט כדי שננסה שוב בהזדמנות הבאה
        prefetchedRef.current.delete(dest.image_url)
      })
    })
  }

  useEffect(() => {
    if (scenes.length === 0) return
    let cancelled = false

    ;(async () => {
      const [{ Viewer }, { MarkersPlugin }] = await Promise.all([
        import('@photo-sphere-viewer/core'),
        import('@photo-sphere-viewer/markers-plugin'),
      ])
      if (cancelled || !containerRef.current) return

      const viewer = new Viewer({
        container: containerRef.current,
        panorama: scenes[0].image_url,
        caption: scenes[0].title,
        navbar: false, // בקרות מותאמות משלנו
        defaultZoomLvl: 45,
        plugins: [[MarkersPlugin, {}]],
      })
      viewerRef.current = viewer

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markers = viewer.getPlugin(MarkersPlugin) as any
      markersPluginRef.current = markers

      viewer.addEventListener('ready', () => {
        if (cancelled) return
        setLoading(false)
        currentSceneRef.current = scenes[0]
        setCurrentId(scenes[0].id)
        renderHotspots(scenes[0])
        prefetchNeighbors(scenes[0])
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      viewer.addEventListener('panorama-error', (e: any) => {
        if (cancelled) return
        setLoading(false)
        // משתיקים את הודעת השגיאה המובנית של PSV — יש לנו משלנו
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        try { (viewer as any).overlay?.hide() } catch { /**/ }
        const err = e?.error
        console.error('[tour] panorama-error:', err, 'url:', e?.panorama)
        setErrorDetail(
          err instanceof Error ? `${err.name}: ${err.message}` : String(err ?? 'load error'),
        )
        // אם אין סצנה נוכחית עדיין — מדובר בכשל בטעינה הראשונית
        setErrorTarget(currentSceneRef.current ?? scenes[0])
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      viewer.addEventListener('fullscreen', (e: any) => {
        if (!cancelled) setFullscreen(!!e.fullscreenEnabled)
      })

      // לחיצה על חץ ניווט → "צועדים" לחדר הבא
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      markers?.addEventListener('select-marker', (e: any) => {
        const data = e.marker?.data
        if (!data?.targetSceneId) return
        const target = scenes.find((s) => s.id === data.targetSceneId)
        if (target) navigateTo(target, { yaw: data.yaw ?? 0, directional: true })
      })
    })()

    return () => {
      cancelled = true
      viewerRef.current?.destroy()
      viewerRef.current = null
      markersPluginRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes])

  const currentScene = scenes.find((s) => s.id === currentId)

  function ctrlBtn(onClick: () => void, label: string, icon: React.ReactNode) {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        title={label}
        className="flex h-10 w-10 items-center justify-center text-paper/85 transition-colors hover:bg-white/10 hover:text-paper"
      >
        {icon}
      </button>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-carbon">
      <div ref={containerRef} className="h-full w-full" />

      {/* שם החדר הנוכחי — pill עליון */}
      {currentScene && !loading && (
        <div className="pointer-events-none absolute right-4 top-4 z-20">
          <span className="rounded-full bg-carbon/60 px-4 py-2 font-display text-caption font-semibold text-paper backdrop-blur-md">
            {currentScene.title}
          </span>
        </div>
      )}

      {/* בקרות — קבוצת כפתורים זכוכיתית */}
      {!loading && (
        <div
          className={`absolute z-20 flex overflow-hidden rounded-full border border-white/10 bg-carbon/55 backdrop-blur-md ${
            isMobile ? 'left-4 top-4' : 'bottom-5 left-5'
          }`}
        >
          {ctrlBtn(() => viewerRef.current?.zoomIn(12), 'התקרב', <ZoomIn size={18} />)}
          <span className="my-2 w-px bg-white/10" />
          {ctrlBtn(() => viewerRef.current?.zoomOut(12), 'התרחק', <ZoomOut size={18} />)}
          <span className="my-2 w-px bg-white/10" />
          {ctrlBtn(
            () => viewerRef.current?.toggleFullscreen(),
            'מסך מלא',
            fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />,
          )}
        </div>
      )}

      {/* רצועת חדרים — נסתרת, נפתחת בריחוף (דסקטופ) או לחיצה (מובייל) */}
      {scenes.length > 1 && !loading && (
        <div className="group/rail absolute inset-x-0 bottom-0 z-30 px-3 pb-3">
          <div
            className={`mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-carbon/75 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out md:group-hover/rail:translate-y-0 ${
              railOpen ? '!translate-y-0' : 'translate-y-[calc(100%-46px)]'
            }`}
          >
            {/* ידית */}
            <button
              onClick={() => setRailOpen((o) => !o)}
              className="flex h-[46px] w-full items-center justify-center gap-2 text-caption font-semibold text-paper/90 transition-colors hover:bg-white/5"
            >
              <ChevronUp
                size={16}
                className={`transition-transform duration-300 ${
                  railOpen ? 'rotate-180' : ''
                } md:group-hover/rail:rotate-180`}
              />
              החדרים בסיור · {scenes.length}
            </button>

            {/* תמונות ממוזערות */}
            <div className="flex gap-2.5 overflow-x-auto px-3 pb-3">
              {scenes.map((s) => {
                const active = s.id === currentId
                return (
                  <button
                    key={s.id}
                    onClick={() => navigateTo(s)}
                    className={`group/thumb relative h-[74px] w-28 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                      active
                        ? 'ring-signal'
                        : 'ring-transparent hover:ring-white/40'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image_url}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon/90 to-transparent px-2 pb-1.5 pt-4 text-right text-[11px] font-medium text-paper">
                      <span className="line-clamp-1">{s.title}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* טעינה ראשונית */}
      {loading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-carbon">
          <span className="spinner inline-block h-8 w-8 rounded-full border-2 border-white/20 border-t-paper" />
          <span className="text-caption text-paper/60">טוען סיור…</span>
        </div>
      )}

      {/* מעבר בין חדרים — אינדיקטור עדין שלא חוסם את ה-crossfade */}
      {navigating && !loading && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
          <span className="flex items-center gap-2.5 rounded-full bg-carbon/70 px-4 py-2.5 backdrop-blur-md">
            <span className="spinner inline-block h-4 w-4 rounded-full border-2 border-white/25 border-t-signal" />
            <span className="text-caption font-medium text-paper">
              {retrying ? 'החיבור איטי — מנסה שוב…' : 'טוען חדר…'}
            </span>
          </span>
        </div>
      )}

      {/* שגיאה — מעוצבת, בעברית */}
      {errorTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-carbon/85 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#2b2b2b] p-7 text-center shadow-2xl">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal/15 text-signal">
              <AlertTriangle size={24} />
            </span>
            <h3 className="mt-4 font-display text-subheading font-bold text-paper">
              לא הצלחנו לטעון את החדר
            </h3>
            <p className="mt-2 text-caption leading-relaxed text-paper/60">
              נראה שיש בעיה זמנית בחיבור לאינטרנט. בדוק את הקליטה ונסה שוב.
            </p>
            {errorDetail && (
              <p
                dir="ltr"
                className="mt-3 max-h-24 overflow-auto break-words rounded-lg bg-black/30 px-3 py-2 text-left text-[11px] leading-snug text-paper/45"
              >
                {errorDetail}
              </p>
            )}
            <button
              onClick={() => navigateTo(errorTarget)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-2.5 text-caption font-semibold text-paper transition-opacity hover:opacity-85"
            >
              <RotateCcw size={16} />
              נסה שוב
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
