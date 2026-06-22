'use client'

// ============================================================
// components/SceneManager.tsx — ניהול סצנות (חדרים) בעורך.
// העלאת תמונות 360° ישירות ל-R2 (presigned), יצירת סצנה לכל תמונה,
// עריכת שם, הגדרת נקודות ניווט (hotspots), ומחיקה.
// ============================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, Trash2, Navigation } from 'lucide-react'
import { Spinner } from '@/components/anim'
import type { TourScene } from '@/lib/types'
import HotspotEditor from '@/components/HotspotEditor'

export default function SceneManager({
  tourId,
  initialScenes,
}: {
  tourId: string
  initialScenes: TourScene[]
}) {
  const router = useRouter()
  const [scenes, setScenes] = useState<TourScene[]>(initialScenes)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [editingHotspotsFor, setEditingHotspotsFor] = useState<TourScene | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    try {
      let index = scenes.length
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setStatus(`מעלה ${i + 1}/${files.length}…`)

        // 1) URL חתום
        const pres = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId, contentType: file.type }),
        }).then((r) => r.json())
        if (!pres.uploadUrl) throw new Error(pres.error || 'יצירת העלאה נכשלה')

        // 2) העלאה ישירה ל-R2
        const put = await fetch(pres.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!put.ok) throw new Error('העלאה ל-R2 נכשלה (בדוק CORS)')

        // 3) יצירת סצנה
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
      }
      setStatus('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'העלאה נכשלה')
    } finally {
      setBusy(false)
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

  async function remove(id: string) {
    if (!confirm('למחוק את החדר הזה?')) return
    await fetch(`/api/scenes/${id}`, { method: 'DELETE' })
    setScenes((prev) => prev.filter((s) => s.id !== id))
    router.refresh()
  }

  function onHotspotsSaved(updated: TourScene) {
    setScenes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    if (editingHotspotsFor?.id === updated.id) {
      setEditingHotspotsFor(updated)
    }
  }

  return (
    <div>
      {/* עורך hotspots — fullscreen overlay */}
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
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate/30 bg-paper p-12 text-center transition-colors hover:border-carbon ${
          busy ? 'pointer-events-none opacity-70' : ''
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
        {busy ? (
          <Spinner className="h-7 w-7" />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-carbon">
            <UploadCloud size={24} />
          </span>
        )}
        <span className="text-body font-semibold text-carbon">
          {busy ? status || 'מעלה…' : 'העלאת תמונות 360°'}
        </span>
        <span className="text-caption text-graphite">
          גרור לכאן או לחץ לבחירה (אפשר כמה ביחד)
        </span>
      </label>

      {error && <p className="mt-3 text-caption text-signal">{error}</p>}

      {/* רשימת החדרים */}
      <div className="mt-8">
        <h2 className="text-body font-semibold text-carbon">
          חדרים ({scenes.length})
        </h2>
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image_url}
                  alt={s.title}
                  className="h-36 w-full bg-mist object-cover"
                />
                <div className="flex items-center gap-2 p-3">
                  <input
                    defaultValue={s.title}
                    onBlur={(e) => {
                      if (e.target.value !== s.title) rename(s.id, e.target.value)
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-transparent bg-fog px-3 py-2 text-caption text-carbon outline-none focus:border-carbon"
                  />
                  <button
                    onClick={() => setEditingHotspotsFor(s)}
                    title="ערוך נקודות ניווט"
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-graphite transition-colors hover:bg-mist hover:text-signal"
                    aria-label="נקודות ניווט"
                  >
                    <Navigation size={17} />
                    {(s.hotspots?.length ?? 0) > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-[10px] font-bold text-paper">
                        {s.hotspots.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => remove(s.id)}
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
