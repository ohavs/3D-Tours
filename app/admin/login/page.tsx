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
        className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-card"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground">
          <Lock size={22} />
        </span>
        <h1 className="mt-5 font-display text-subheading font-extrabold text-foreground">
          אזור ניהול
        </h1>
        <p className="mt-1 text-caption text-muted-foreground">הזן סיסמה כדי להמשיך.</p>

        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="סיסמה"
          className="mt-6 w-full rounded-xl border border-border bg-muted px-4 py-3.5 text-body text-foreground outline-none transition-all focus:border-border-strong focus:bg-surface focus:ring-4 focus:ring-foreground/5"
        />

        {error && <p className="mt-3 text-caption text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-body font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner className="h-4 w-4 border-background/40 border-t-background" />
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
