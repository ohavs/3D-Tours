'use client'

// ============================================================
// components/NewTourForm.tsx — טופס יצירת סיור חדש.
// יוצר רשומת סיור (שם + slug). את החדרים/הנקודות מוסיפים בעורך.
// ============================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/anim'

const field =
  'mt-1.5 w-full rounded-xl border border-slate/20 bg-fog px-4 py-3.5 text-body text-carbon outline-none transition-all focus:border-carbon focus:bg-paper focus:ring-4 focus:ring-carbon/5'

export default function NewTourForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'יצירה נכשלה')
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'יצירה נכשלה')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate/15 bg-paper p-8 shadow-card"
    >
      <label className="block">
        <span className="text-caption font-medium text-graphite">שם הנכס</span>
        <input name="title" required placeholder="למשל: דירת 4 חדרים, תל אביב" className={field} />
      </label>

      <label className="mt-5 block">
        <span className="text-caption font-medium text-graphite">
          כתובת הסיור (אנגלית, אופציונלי)
        </span>
        <input
          name="slug"
          dir="ltr"
          placeholder="apartment-tlv"
          className={`${field} text-left`}
        />
        <span className="mt-1.5 block text-caption text-slate">
          אם תשאיר ריק — ייווצר מזהה אוטומטי.
        </span>
      </label>

      {error && <p className="mt-4 text-caption text-signal">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-carbon px-7 py-3.5 text-body font-semibold text-paper transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Spinner className="h-4 w-4 border-paper/40 border-t-paper" />
            יוצר…
          </>
        ) : (
          'צור סיור'
        )}
      </button>
    </form>
  )
}
