'use client'

// ============================================================
// components/ContactForm.tsx — טופס "צור קשר"
// שולח ל-/api/leads (נשמר ב-Supabase). מצבי טעינה/הצלחה/שגיאה
// עם לואדר.
// ============================================================

import { useState } from 'react'
import { Spinner } from '@/components/anim'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'שליחה נכשלה')
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'שליחה נכשלה')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-slate/15 bg-paper p-8 text-center shadow-soft">
        <p className="font-display text-subheading font-extrabold text-carbon">
          קיבלתי! אחזור אליך בהקדם 🎬
        </p>
        <p className="mt-2 text-body text-graphite">תודה על הפנייה.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-slate/15 bg-paper p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-caption font-medium text-graphite">שם</span>
          <input
            name="name"
            required
            className="mt-1.5 w-full rounded-lg border border-slate/25 bg-fog px-4 py-3 text-body text-carbon outline-none transition-colors focus:border-carbon"
            placeholder="השם שלך"
          />
        </label>
        <label className="block">
          <span className="text-caption font-medium text-graphite">טלפון</span>
          <input
            name="phone"
            inputMode="tel"
            dir="ltr"
            className="mt-1.5 w-full rounded-lg border border-slate/25 bg-fog px-4 py-3 text-right text-body text-carbon outline-none transition-colors focus:border-carbon"
            placeholder="050-0000000"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-caption font-medium text-graphite">פרטי הנכס / הודעה</span>
        <textarea
          name="message"
          rows={4}
          className="mt-1.5 w-full resize-none rounded-lg border border-slate/25 bg-fog px-4 py-3 text-body text-carbon outline-none transition-colors focus:border-carbon"
          placeholder="כתובת, סוג הנכס, וכל פרט שיעזור לי להתכונן"
        />
      </label>

      {status === 'error' && (
        <p className="mt-3 text-caption text-signal">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-carbon px-7 py-3.5 text-body font-semibold text-paper transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Spinner className="h-4 w-4 border-paper/40 border-t-paper" />
            שולח…
          </>
        ) : (
          'שליחה'
        )}
      </button>
    </form>
  )
}
