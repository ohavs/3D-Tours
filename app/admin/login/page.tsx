'use client'

// ============================================================
// app/admin/login/page.tsx — מסך כניסה לאזור הניהול.
// ============================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Spinner } from '@/components/anim'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const password = new FormData(e.currentTarget).get('password')
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'כניסה נכשלה')
      }
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'כניסה נכשלה')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl border border-slate/15 bg-paper p-8 shadow-card"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-carbon">
          <Lock size={22} />
        </span>
        <h1 className="mt-5 font-display text-subheading font-extrabold text-carbon">
          אזור ניהול
        </h1>
        <p className="mt-1 text-caption text-graphite">הזן סיסמה כדי להמשיך.</p>

        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="סיסמה"
          className="mt-6 w-full rounded-xl border border-slate/20 bg-fog px-4 py-3.5 text-body text-carbon outline-none transition-all focus:border-carbon focus:bg-paper focus:ring-4 focus:ring-carbon/5"
        />

        {error && <p className="mt-3 text-caption text-signal">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-carbon py-3.5 text-body font-semibold text-paper transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner className="h-4 w-4 border-paper/40 border-t-paper" />
              נכנס…
            </>
          ) : (
            'כניסה'
          )}
        </button>
      </form>
    </main>
  )
}
