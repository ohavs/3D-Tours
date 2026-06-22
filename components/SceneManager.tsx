'use client'

// ============================================================
// components/SceneManager.tsx — ניהול סצנות (חדרים) בעורך.
// העלאת תמונות 360° ישירות ל-R2, loader לכל כרטיס, עריכת שם,
// hotspots, ומחיקה.
// ============================================================

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, Trash2, Navigation } from 'lucide-react'
import { Spinner } from '@/components/anim'
import { useNotify } from '@/components/ui/Notifications'
import type { TourScene } from '@/lib/types'
import HotspotEditor from '@/components/HotspotEditor'

// מורידים ברזולוציה תמונות פנורמה ענקיות לפני העלאה. תמונות 360°
// יוצאות מהמצלמה בגדלים אדירים (למשל 11904 פיקסל רוחב) שחורגים
// ממגבלת הטקסטורה של מכשירים ניידים → "panorama cannot be loaded".
// קיצור ל-4096 רוחב נטען בכל מכשיר ושומר על איכות מצוינת לסיור.
const MAX_PANORAMA_WIDTH = 4096

async function downscalePanorama(
  file: File,
): Promise<{ blob: Blob; type: string }> {
  // רק תמונות; אם משהו משתבש — מעלים את הקובץ המקורי
  if (!file.type.startsWith('image/')) return { blob: file, type: file.type }
  try {
    const bitmap = await createImageBitmap(file)
    if (bitmap.width <= MAX_PANORAMA_WIDTH) {
      bitmap.close?.()
      return { blob: file, type: file.type }
    }
    const targetW = MAX_PANORAMA_WIDTH
    const targetH = Math.round((bitmap.height * MAX_PANORAMA_WIDTH) / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close?.()
      return { blob: file, type: file.type }
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH)
    bitmap.close?.()
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, 'image/jpeg', 0.9),
    )
    return blob ? { blob, type: 'image/jpeg' } : { blob: file, type: file.type }
  } catch {
    return { blob: file, type: file.type }
  }
}

// Shimmer placeholder while an image loads from R2
function ImageCard({ scene, onImgLoad }: { scene: TourScene; onImgLoad: (id: string) => void }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative h-36 w-full overflow-hidden bg-mist">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-mist via-fog to-mist" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={scene.image_url}
        alt={scene.title}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => { setLoaded(true); onImgLoad(scene.id) }}
      />
    </div>
  )
}

export default function SceneManager({
  tourId,
  initialScenes,
}: {
  tourId: string
  initialScenes: TourScene[]
}) {
  const router = useRouter()
  const { toast, confirm } = useNotify()
  const [scenes, setScenes] = useState<TourScene[]>(initialScenes)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError] = useState('')
  const [editingHotspotsFor, setEditingHotspotsFor] = useState<TourScene | null>(null)
  // track which new scene cards just appeared (to show their shimmer)
  const freshIds = useRef(new Set<string>())

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    setProgress({ current: 0, total: files.length })
    try {
      let index = scenes.length
      const added: TourScene[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress({ current: i + 1, total: files.length })

        // 0) קיצור רזולוציה למובייל-תאימות (ראה הערה למעלה)
        const { blob, type } = await downscalePanorama(file)

        // 1) presigned URL
        const pres = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId, contentType: type }),
        }).then((r) => r.json())
        if (!pres.uploadUrl) throw new Error(pres.error || 'יצירת העלאה נכשלה')

        // 2) upload directly to R2
        const put = await fetch(pres.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': type },
          body: blob,
        })
        if (!put.ok) throw new Error('העלאה ל-R2 נכשלה (בדוק CORS)')

        // 3) create scene record
        const sceneRes = await fetch('/api/scenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tour_id: tourId,
            title: file.name.replace(/\.[^.]+$/, ''),
            image_url: pres.url,
            order_index: index++,
          }),
        }).then((r) => r.json())
        if (sceneRes.error) throw new Error(sceneRes.error)
        if (sceneRes.scene) {
          freshIds.current.add(sceneRes.scene.id)
          added.push(sceneRes.scene as TourScene)
        }
      }
      setScenes((prev) => [...prev, ...added])
      if (added.length > 0) {
        toast(
          added.length === 1 ? 'החדר נוסף בהצלחה' : `${added.length} חדרים נוספו`,
          'success',
        )
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'העלאה נכשלה'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setBusy(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  async function rename(id: string, title: string) {
    await fetch(`/api/scenes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    router.refresh()
  }

  async function remove(scene: TourScene) {
    const ok = await confirm({
      title: 'למחוק את החדר?',
      message: `"${scene.title}" יימחק לצמיתות, יחד עם התמונה ונקודות הניווט שלו. לא ניתן לבטל פעולה זו.`,
      confirmLabel: 'מחק חדר',
      danger: true,
    })
    if (!ok) return
    await fetch(`/api/scenes/${scene.id}`, { method: 'DELETE' })
    setScenes((prev) => prev.filter((s) => s.id !== scene.id))
    toast('החדר נמחק', 'success')
  }

  function onHotspotsSaved(updated: TourScene) {
    setScenes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    if (editingHotspotsFor?.id === updated.id) {
      setEditingHotspotsFor(updated)
    }
  }

  const canAddHotspots = scenes.length >= 2

  return (
    <div>
      {/* hotspot editor — fullscreen overlay */}
      {editingHotspotsFor && (
        <HotspotEditor
          scene={editingHotspotsFor}
          allScenes={scenes}
          onClose={() => setEditingHotspotsFor(null)}
          onSaved={onHotspotsSaved}
        />
      )}

      {/* upload area */}
      <label
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed border-slate/30 bg-paper p-12 text-center transition-colors hover:border-carbon ${
          busy ? 'pointer-events-none' : ''
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* progress bar strip at the bottom of the upload area */}
        {busy && progress.total > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-mist">
            <div
              className="h-full bg-signal transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        )}

        {busy ? (
          <Spinner className="h-7 w-7" />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-carbon">
            <UploadCloud size={24} />
          </span>
        )}
        <span className="text-body font-semibold text-carbon">
          {busy
            ? progress.total > 1
              ? `מעלה ${progress.current} מתוך ${progress.total}…`
              : 'מעלה…'
            : 'העלאת תמונות 360°'}
        </span>
        <span className="text-caption text-graphite">
          {busy
            ? 'אנא המתן, זה עלול לקחת כמה שניות'
            : 'גרור לכאן או לחץ לבחירה (אפשר כמה ביחד)'}
        </span>
      </label>

      {error && <p className="mt-3 text-caption text-signal">{error}</p>}

      {/* scene list */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-body font-semibold text-carbon">
            חדרים ({scenes.length})
          </h2>
          {scenes.length === 1 && (
            <p className="text-caption text-graphite">
              העלה חדר נוסף כדי להגדיר נקודות ניווט
            </p>
          )}
        </div>

        {scenes.length === 0 ? (
          <p className="mt-3 text-caption text-graphite">
            עדיין אין חדרים. העלה תמונה כדי להתחיל.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {scenes.map((s) => (
              <div
                key={s.id}
                className="overflow-hidden rounded-2xl border border-slate/15 bg-paper"
              >
                <ImageCard scene={s} onImgLoad={(id) => freshIds.current.delete(id)} />
                <div className="flex items-center gap-2 p-3">
                  <input
                    defaultValue={s.title}
                    onBlur={(e) => {
                      if (e.target.value !== s.title) rename(s.id, e.target.value)
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-transparent bg-fog px-3 py-2 text-caption text-carbon outline-none focus:border-carbon"
                  />

                  {/* hotspot button — disabled tooltip when only 1 scene */}
                  <div className="group relative">
                    <button
                      onClick={() => canAddHotspots && setEditingHotspotsFor(s)}
                      title={canAddHotspots ? 'ערוך נקודות ניווט' : 'דרושים לפחות 2 חדרים'}
                      disabled={!canAddHotspots}
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        canAddHotspots
                          ? 'text-graphite hover:bg-mist hover:text-signal'
                          : 'cursor-not-allowed text-slate/40'
                      }`}
                      aria-label="נקודות ניווט"
                    >
                      <Navigation size={17} />
                      {(s.hotspots?.length ?? 0) > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-[10px] font-bold text-paper">
                          {s.hotspots.length}
                        </span>
                      )}
                    </button>
                    {/* tooltip for disabled state */}
                    {!canAddHotspots && (
                      <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-max rounded-lg bg-carbon px-2.5 py-1.5 text-caption text-paper opacity-0 transition-opacity group-hover:opacity-100">
                        העלה חדר נוסף כדי לחבר
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => remove(s)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-graphite transition-colors hover:bg-mist hover:text-signal"
                    aria-label="מחק"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
