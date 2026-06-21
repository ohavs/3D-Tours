'use client'

// ============================================================
// components/ContactForm.tsx — טופס "צור קשר"
// שולח ל-/api/leads (נשמר ב-Supabase). מצבי טעינה/הצלחה/שגיאה
// עם לואדר.
// ============================================================

import { useState } from 'react'
import { User, Phone, MessageSquare } from 'lucide-react'
import { Spinner } from '@/components/anim'

const fieldBase =
  'w-full rounded-xl border border-slate/20 bg-fog py-3.5 pr-11 pl-4 text-body text-carbon outline-none transition-all placeholder:text-slate focus:border-carbon focus:bg-paper focus:ring-4 focus:ring-carbon/5'

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
      <div className="flex h-full flex-col items-center justify-center py-8 text-center">
        <p className="font-display text-subheading font-extrabold text-carbon">
          קיבלתי! אחזור אליך בהקדם 🎬
        </p>
        <p className="mt-2 text-body text-graphite">תודה על הפנייה.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-caption font-medium text-graphite">שם</span>
          <div className="relative">
            <User className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-graphite" size={18} />
            <input name="name" required className={fieldBase} placeholder="השם שלך" />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-caption font-medium text-graphite">טלפון</span>
          <div className="relative">
            <Phone className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-graphite" size={18} />
            <input
              name="phone"
              inputMode="tel"
              dir="ltr"
              className={`${fieldBase} text-right`}
              placeholder="050-0000000"
            />
          </div>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-caption font-medium text-graphite">פרטי הנכס / הודעה</span>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute right-3.5 top-4 text-graphite" size={18} />
          <textarea
            name="message"
            rows={4}
            className={`${fieldBase} resize-none`}
            placeholder="כתובת, סוג הנכס, וכל פרט שיעזור לי להתכונן"
          />
        </div>
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
