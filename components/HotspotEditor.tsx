'use client'

// ============================================================
// components/HotspotEditor.tsx — עורך נקודות ניווט בין חדרים.
// מציג PSV עם MarkersPlugin; לחיצה על הפנורמה מוסיפה hotspot חדש.
// ============================================================

import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, MousePointerClick, Trash2, Check } from 'lucide-react'
import { Spinner } from '@/components/anim'
import { useNotify } from '@/components/ui/Notifications'
import Select from '@/components/ui/Select'
import type { TourScene, Hotspot } from '@/lib/types'

interface Props {
  scene: TourScene
  allScenes: TourScene[]
  onClose: () => void
  onSaved: (updated: TourScene) => void
}

interface PendingHotspot {
  pitch: number
  yaw: number
}

// SVG arrow marker — white circle with arrow icon
function markerSvg(label: string) {
  const escaped = label.replace(/[<>&"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] ?? c),
  )
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
  <circle cx="26" cy="26" r="24" fill="rgba(255,104,44,0.92)" stroke="white" stroke-width="2.5"/>
  <text x="26" y="30" font-family="system-ui,sans-serif" font-size="11" font-weight="600"
    fill="white" text-anchor="middle" dominant-baseline="middle">${escaped}</text>
</svg>`
}

function pendingSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
  <circle cx="22" cy="22" r="20" fill="rgba(255,104,44,0.6)" stroke="white" stroke-width="2"
    stroke-dasharray="5 3"/>
  <text x="22" y="26" font-family="system-ui,sans-serif" font-size="18" fill="white"
    text-anchor="middle" dominant-baseline="middle">+</text>
</svg>`
}

export default function HotspotEditor({ scene, allScenes, onClose, onSaved }: Props) {
  const { toast, confirm } = useNotify()
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [pending, setPending] = useState<PendingHotspot | null>(null)
  const [hotspots, setHotspots] = useState<Hotspot[]>(scene.hotspots ?? [])
  const [targetId, setTargetId] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const viewerRef = useRef<{ destroy: () => void } | null>(null)
  const markersRef = useRef<{ addMarker: (m: unknown) => void; removeMarker: (id: string) => void; updateMarker: (m: unknown) => void } | null>(null)
  const placingRef = useRef(false)

  // keep ref in sync
  useEffect(() => {
    placingRef.current = placing
  }, [placing])

  const targetScenes = allScenes.filter((s) => s.id !== scene.id)

  // render all markers into the plugin
  const syncMarkers = useCallback((hs: Hotspot[]) => {
    const mp = markersRef.current
    if (!mp) return
    hs.forEach((h) => {
      try { mp.removeMarker(`hs-${h.id}`) } catch { /* doesn't exist yet */ }
      mp.addMarker({
        id: `hs-${h.id}`,
        position: { pitch: h.pitch, yaw: h.yaw },
        html: markerSvg(h.text),
        size: { width: 52, height: 52 },
        anchor: 'center',
        tooltip: `→ ${h.text}`,
        data: { hotspotId: h.id },
      })
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const [{ Viewer }, { MarkersPlugin }] = await Promise.all([
        import('@photo-sphere-viewer/core'),
        import('@photo-sphere-viewer/markers-plugin'),
      ])
      if (cancelled || !containerRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewer: any = new Viewer({
        container: containerRef.current,
        panorama: scene.image_url,
        caption: scene.title,
        navbar: ['zoom', 'caption', 'fullscreen'],
        plugins: [[MarkersPlugin, {}]],
      })

      viewerRef.current = viewer as unknown as { destroy: () => void }

      viewer.addEventListener('ready', () => {
        if (cancelled) return
        setLoading(false)

        const mp = viewer.getPlugin(MarkersPlugin) as typeof markersRef.current
        markersRef.current = mp

        // initial hotspots
        syncMarkers(scene.hotspots ?? [])

        // click on the sphere to place hotspot
        viewer.addEventListener('click', (e: { data: { pitch: number; yaw: number } }) => {
          if (!placingRef.current) return
          const { pitch, yaw } = e.data

          // show pending marker
          try { mp?.removeMarker('pending') } catch { /**/ }
          mp?.addMarker({
            id: 'pending',
            position: { pitch, yaw },
            html: pendingSvg(),
            size: { width: 44, height: 44 },
            anchor: 'center',
          })

          setPending({ pitch, yaw })
          setPlacing(false) // exit placing mode, wait for target selection
        })
      })
    })()

    return () => {
      cancelled = true
      viewerRef.current?.destroy()
      viewerRef.current = null
      markersRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function cancelPending() {
    try { markersRef.current?.removeMarker('pending') } catch { /**/ }
    setPending(null)
    setTargetId('')
    setLabel('')
  }

  function addHotspot() {
    if (!pending || !targetId) return
    const targetScene = allScenes.find((s) => s.id === targetId)
    const text = label.trim() || targetScene?.title || 'חדר'
    const id = crypto.randomUUID()
    const hs: Hotspot = { id, pitch: pending.pitch, yaw: pending.yaw, target_scene_id: targetId, text }
    const next = [...hotspots, hs]
    setHotspots(next)

    // replace pending marker with real one
    try { markersRef.current?.removeMarker('pending') } catch { /**/ }
    markersRef.current?.addMarker({
      id: `hs-${id}`,
      position: { pitch: hs.pitch, yaw: hs.yaw },
      html: markerSvg(text),
      size: { width: 52, height: 52 },
      anchor: 'center',
      tooltip: `→ ${text}`,
    })

    setPending(null)
    setTargetId('')
    setLabel('')
    setDirty(true)
  }

  async function removeHotspot(hs: Hotspot) {
    const ok = await confirm({
      title: 'למחוק נקודת ניווט?',
      message: `הנקודה "${hs.text}" תוסר מהחדר הזה.`,
      confirmLabel: 'מחק',
      danger: true,
    })
    if (!ok) return
    try { markersRef.current?.removeMarker(`hs-${hs.id}`) } catch { /**/ }
    setHotspots((prev) => prev.filter((h) => h.id !== hs.id))
    setDirty(true)
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/scenes/${scene.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotspots }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setDirty(false)
      onSaved({ ...scene, hotspots })
      toast('נקודות הניווט נשמרו', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'השמירה נכשלה', 'error')
    } finally {
      setSaving(false)
    }
  }

  // יציאה — אם יש שינויים שלא נשמרו, מבקשים אישור
  async function handleClose() {
    if (dirty) {
      const leave = await confirm({
        title: 'לצאת בלי לשמור?',
        message: 'יש שינויים בנקודות הניווט שלא נשמרו. אם תצא, הם יאבדו.',
        confirmLabel: 'צא בלי לשמור',
        cancelLabel: 'המשך עריכה',
        danger: true,
      })
      if (!leave) return
    }
    onClose()
  }

  // אזהרת דפדפן בעת רענון/סגירת טאב עם שינויים
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-carbon" dir="rtl">
      {/* top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-carbon px-5 py-3">
        <span className="font-display text-body font-semibold text-paper">
          נקודות ניווט — {scene.title}
        </span>
        <div className="flex items-center gap-2.5">
          {dirty && (
            <span className="hidden items-center gap-1.5 text-caption font-medium text-paper/50 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              שינויים שלא נשמרו
            </span>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-1.5 rounded-full bg-signal px-4 py-2 text-caption font-semibold text-paper transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {saving ? <Spinner className="h-4 w-4" /> : <Check size={15} />}
            שמור
          </button>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-white/10 hover:text-paper"
            aria-label="סגור"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* main: viewer + sidebar */}
      <div className="flex min-h-0 flex-1">
        {/* viewer */}
        <div className="relative flex-1">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-carbon">
              <Spinner className="h-8 w-8" />
            </div>
          )}
          <div ref={containerRef} className="h-full w-full" />

          {/* no-rooms notice */}
          {targetScenes.length === 0 && !loading && (
            <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-white/10 bg-carbon/90 p-5 text-center shadow-xl backdrop-blur-sm">
              <p className="text-body font-semibold text-paper">אין עדיין חדרים נוספים</p>
              <p className="text-caption text-paper/60">
                כדי להגדיר נקודת ניווט צריך לפחות שני חדרים בסיור. סגור, העלה עוד תמונה ואז חזור לכאן.
              </p>
              <button
                onClick={handleClose}
                className="mt-1 rounded-full bg-signal px-5 py-2 text-caption font-semibold text-paper transition-opacity hover:opacity-85"
              >
                סגור והוסף חדר
              </button>
            </div>
          )}

          {/* place-mode toggle — only shown when there are target scenes */}
          {!pending && targetScenes.length > 0 && (
            <button
              onClick={() => setPlacing((p) => !p)}
              className={`absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-caption font-semibold shadow-lg transition-all ${
                placing
                  ? 'bg-signal text-paper'
                  : 'bg-paper text-carbon hover:bg-mist'
              }`}
            >
              <MousePointerClick size={16} />
              {placing ? 'לחץ על הפנורמה להנחת נקודה' : 'הוסף נקודת ניווט'}
            </button>
          )}

          {/* pending hotspot panel */}
          {pending && (
            <div className="absolute bottom-6 right-6 z-20 w-72 rounded-2xl border border-white/10 bg-carbon/95 p-4 shadow-xl backdrop-blur-sm">
              <p className="text-caption font-semibold text-paper">לאיזה חדר תוביל הנקודה?</p>
              <div className="mt-2">
                <Select
                  theme="dark"
                  value={targetId}
                  onChange={setTargetId}
                  placeholder="בחר חדר…"
                  options={targetScenes.map((s) => ({ value: s.id, label: s.title }))}
                />
              </div>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="תווית (אופציונלי)"
                className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-caption text-paper placeholder-white/40 outline-none focus:ring-1 focus:ring-signal"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={addHotspot}
                  disabled={!targetId}
                  className="flex-1 rounded-lg bg-signal py-2 text-caption font-semibold text-paper transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  הוסף
                </button>
                <button
                  onClick={cancelPending}
                  className="flex-1 rounded-lg bg-white/10 py-2 text-caption text-paper transition-colors hover:bg-white/20"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}
        </div>

        {/* sidebar: hotspot list */}
        <div className="w-64 shrink-0 overflow-y-auto border-r border-white/10 bg-carbon/80 p-4">
          <p className="text-caption font-semibold text-paper/80">
            נקודות ניווט ({hotspots.length})
          </p>
          {hotspots.length === 0 ? (
            <p className="mt-3 text-caption text-paper/40">
              לחץ על "הוסף נקודת ניווט" כדי להתחיל.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {hotspots.map((h) => {
                const dest = allScenes.find((s) => s.id === h.target_scene_id)
                return (
                  <div
                    key={h.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-caption font-medium text-paper">{h.text}</p>
                      <p className="truncate text-caption text-paper/50">→ {dest?.title ?? h.target_scene_id}</p>
                    </div>
                    <button
                      onClick={() => removeHotspot(h)}
                      className="shrink-0 text-paper/40 transition-colors hover:text-signal"
                      aria-label="מחק"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
