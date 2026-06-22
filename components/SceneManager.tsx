'use client'

// ============================================================
// components/SceneManager.tsx — ניהול סצנות (חדרים) בעורך.
// העלאה (גרירה/לחיצה) עם הקטנת רזולוציה, סידור מחדש בגרירה לקביעת
// החדר הראשון, שינוי שם מיידי, נקודות ניווט, ומחיקה עם אינדיקציה.
// ============================================================

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  UploadCloud,
  Trash2,
  Navigation,
  GripVertical,
  Home,
  Loader2,
} from 'lucide-react'
import { Spinner } from '@/components/anim'
import { useNotify } from '@/components/ui/Notifications'
import type { TourScene } from '@/lib/types'
import HotspotEditor from '@/components/HotspotEditor'

// מורידים ברזולוציה תמונות פנורמה ענקיות לפני העלאה. תמונות 360°
// יוצאות מהמצלמה בגדלים אדירים (למשל 11904 פיקסל רוחב) שחורגים
// ממגבלת הטקסטורה/זיכרון של מכשירים ניידים → "panorama cannot be loaded".
// קיצור ל-4096 רוחב נטען בכל מכשיר ושומר על איכות מצוינת לסיור.
const MAX_PANORAMA_WIDTH = 4096

async function downscalePanorama(
  file: File,
): Promise<{ blob: Blob; type: string }> {
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

// תמונה ממוזערת עם shimmer עד שהיא נטענת מ-R2
function Thumb({ scene }: { scene: TourScene }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-mist">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-mist via-fog to-mist" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={scene.image_url}
        alt={scene.title}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
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
  const [dragOver, setDragOver] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingHotspotsFor, setEditingHotspotsFor] = useState<TourScene | null>(null)
  // אינדקס הכרטיס הנגרר (לסידור מחדש)
  const dragIndex = useRef<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) {
      toast('אפשר להעלות קבצי תמונה בלבד', 'error')
      return
    }
    setBusy(true)
    setProgress({ current: 0, total: images.length })
    try {
      let index = scenes.length
      const added: TourScene[] = []
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        setProgress({ current: i + 1, total: images.length })

        const { blob, type } = await downscalePanorama(file)

        const pres = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId, contentType: type }),
        }).then((r) => r.json())
        if (!pres.uploadUrl) throw new Error(pres.error || 'יצירת העלאה נכשלה')

        const put = await fetch(pres.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': type },
          body: blob,
        })
        if (!put.ok) throw new Error('העלאה ל-R2 נכשלה (בדוק CORS)')

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
        if (sceneRes.scene) added.push(sceneRes.scene as TourScene)
      }
      setScenes((prev) => [...prev, ...added])
      if (added.length > 0) {
        toast(
          added.length === 1 ? 'החדר נוסף בהצלחה' : `${added.length} חדרים נוספו`,
          'success',
        )
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'העלאה נכשלה', 'error')
    } finally {
      setBusy(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (busy) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length) uploadFiles(files)
  }

  function rename(id: string, title: string) {
    const clean = title.trim() || 'חדר'
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, title: clean } : s)))
    fetch(`/api/scenes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: clean }),
    }).catch(() => toast('שמירת השם נכשלה', 'error'))
  }

  async function remove(scene: TourScene) {
    const ok = await confirm({
      title: 'למחוק את החדר?',
      message: `"${scene.title}" יימחק לצמיתות, יחד עם התמונה ונקודות הניווט שלו. לא ניתן לבטל פעולה זו.`,
      confirmLabel: 'מחק חדר',
      danger: true,
    })
    if (!ok) return
    setDeletingId(scene.id)
    try {
      const res = await fetch(`/api/scenes/${scene.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setScenes((prev) => prev.filter((s) => s.id !== scene.id))
      toast('החדר נמחק', 'success')
    } catch {
      toast('מחיקת החדר נכשלה', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // --- סידור מחדש בגרירה (קובע את החדר הראשון) ---
  function onCardDragStart(i: number) {
    dragIndex.current = i
  }
  function onCardDragOver(e: React.DragEvent, i: number) {
    if (dragIndex.current === null) return // גרירת קובץ מבחוץ — לא רלוונטי
    e.preventDefault()
    setOverIndex(i)
  }
  async function onCardDrop(i: number) {
    const from = dragIndex.current
    dragIndex.current = null
    setOverIndex(null)
    if (from === null || from === i) return
    const next = [...scenes]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    setScenes(next)
    // שומרים את הסדר החדש
    try {
      await Promise.all(
        next.map((s, idx) =>
          fetch(`/api/scenes/${s.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_index: idx }),
          }),
        ),
      )
      router.refresh()
    } catch {
      toast('שמירת הסדר נכשלה', 'error')
    }
  }

  function onHotspotsSaved(updated: TourScene) {
    setScenes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    if (editingHotspotsFor?.id === updated.id) setEditingHotspotsFor(updated)
  }

  const canAddHotspots = scenes.length >= 2

  return (
    <div>
      {editingHotspotsFor && (
        <HotspotEditor
          scene={editingHotspotsFor}
          allScenes={scenes}
          onClose={() => setEditingHotspotsFor(null)}
          onSaved={onHotspotsSaved}
        />
      )}

      {/* אזור העלאה */}
      <label
        onDragOver={(e) => {
          e.preventDefault()
          if (!busy) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver
            ? 'border-signal bg-signal/5'
            : 'border-slate/30 bg-paper hover:border-carbon'
        } ${busy ? 'pointer-events-none' : ''}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            if (e.target.files) uploadFiles(Array.from(e.target.files))
            e.target.value = ''
          }}
        />

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
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
              dragOver ? 'bg-signal text-paper' : 'bg-mist text-carbon'
            }`}
          >
            <UploadCloud size={24} />
          </span>
        )}
        <span className="text-body font-semibold text-carbon">
          {busy
            ? progress.total > 1
              ? `מעלה ${progress.current} מתוך ${progress.total}…`
              : 'מעלה…'
            : dragOver
              ? 'שחרר כדי להעלות'
              : 'העלאת תמונות 360°'}
        </span>
        <span className="text-caption text-graphite">
          {busy
            ? 'אנא המתן, מקטינים ומעלים את התמונות'
            : 'גרור תמונות לכאן או לחץ לבחירה (אפשר כמה יחד)'}
        </span>
      </label>

      {/* רשימת החדרים */}
      <div className="mt-9">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-subheading font-bold text-carbon">
            החדרים בסיור
            <span className="mr-2 text-graphite">{scenes.length}</span>
          </h2>
          {scenes.length >= 2 && (
            <p className="hidden text-caption text-graphite sm:block">
              גרור כרטיסים כדי לשנות סדר · הראשון הוא נקודת הכניסה
            </p>
          )}
        </div>

        {scenes.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-slate/25 bg-fog/50 p-10 text-center">
            <p className="text-body text-graphite">
              עדיין אין חדרים. העלה תמונת 360° כדי להתחיל.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenes.map((s, i) => {
              const isFirst = i === 0
              const isDeleting = deletingId === s.id
              return (
                <div
                  key={s.id}
                  draggable={!isDeleting}
                  onDragStart={() => onCardDragStart(i)}
                  onDragOver={(e) => onCardDragOver(e, i)}
                  onDrop={() => onCardDrop(i)}
                  onDragEnd={() => {
                    dragIndex.current = null
                    setOverIndex(null)
                  }}
                  className={`group relative overflow-hidden rounded-2xl border bg-paper transition-all ${
                    overIndex === i
                      ? 'border-signal ring-2 ring-signal/30'
                      : 'border-slate/15'
                  } ${isDeleting ? 'opacity-60' : ''}`}
                >
                  {/* מחיקה בתהליך */}
                  {isDeleting && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-paper/80 backdrop-blur-sm">
                      <Loader2 size={24} className="animate-spin text-signal" />
                      <span className="text-caption font-medium text-carbon">מוחק…</span>
                    </div>
                  )}

                  {/* תמונה + תגיות */}
                  <div className="relative">
                    <Thumb scene={s} />

                    {/* ידית גרירה */}
                    <span className="absolute right-2 top-2 flex h-8 w-8 cursor-grab items-center justify-center rounded-lg bg-carbon/55 text-paper opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing">
                      <GripVertical size={16} />
                    </span>

                    {/* תגית חדר ראשון */}
                    {isFirst && (
                      <span className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-full bg-signal px-3 py-1 text-[12px] font-semibold text-paper shadow-soft">
                        <Home size={13} />
                        חדר ראשון
                      </span>
                    )}
                  </div>

                  {/* פעולות */}
                  <div className="flex items-center gap-2 p-3">
                    <input
                      defaultValue={s.title}
                      onBlur={(e) => {
                        if (e.target.value.trim() !== s.title) rename(s.id, e.target.value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-transparent bg-fog px-3 py-2 text-caption font-medium text-carbon outline-none transition-colors focus:border-carbon focus:bg-paper"
                    />

                    <div className="group/btn relative">
                      <button
                        onClick={() => canAddHotspots && setEditingHotspotsFor(s)}
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
                      {!canAddHotspots && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-lg bg-carbon px-2.5 py-1.5 text-[12px] text-paper opacity-0 transition-opacity group-hover/btn:opacity-100">
                          דרושים לפחות 2 חדרים
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => remove(s)}
                      disabled={isDeleting}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-graphite transition-colors hover:bg-mist hover:text-signal disabled:opacity-50"
                      aria-label="מחק"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
