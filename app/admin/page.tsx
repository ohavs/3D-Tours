// ============================================================
// app/admin/page.tsx — דאשבורד ניהול (מוגן).
// מציג את רשימת הסיורים ומאפשר ליצור חדש.
// ============================================================

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, ExternalLink, LogOut } from 'lucide-react'
import { isAuthed } from '@/lib/auth'
import ThemeToggle from '@/components/ThemeToggle'
import { createServiceClient } from '@/lib/supabase'
import type { Tour } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAuthed())) redirect('/admin/login')

  let tours: Tour[] = []
  let error: string | null = null
  try {
    const supabase = createServiceClient()
    const { data, error: e } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false })
    if (e) throw new Error(e.message)
    tours = (data as Tour[]) ?? []
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-12">
      {/* כותרת + פעולות */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-heading-sm font-extrabold text-foreground">
            ניהול סיורים
          </h1>
          <p className="mt-1 text-caption text-muted-foreground">
            {tours.length} סיורים
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-caption font-semibold text-background transition-opacity hover:opacity-85"
          >
            <Plus size={17} strokeWidth={2.4} />
            סיור חדש
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-caption font-semibold text-foreground transition-colors hover:bg-muted">
              <LogOut size={16} />
              יציאה
            </button>
          </form>
        </div>
      </div>

      {/* שגיאת חיבור */}
      {error && (
        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5 text-body text-foreground">
          <p className="font-semibold">לא הצלחתי לטעון סיורים</p>
          <p className="mt-1 text-caption text-muted-foreground" dir="ltr">{error}</p>
          <p className="mt-2 text-caption text-muted-foreground">
            ודא שהרצת את ה-SQL ושמשתני הסביבה של Supabase מוגדרים ב-Vercel.
          </p>
        </div>
      )}

      {/* רשימה / מצב ריק */}
      {!error && tours.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
          <p className="font-display text-subheading font-extrabold text-foreground">
            עדיין אין סיורים
          </p>
          <p className="mt-2 text-body text-muted-foreground">
            צור את הסיור הראשון שלך כדי להתחיל.
          </p>
          <Link
            href="/admin/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-body font-semibold text-background transition-opacity hover:opacity-85"
          >
            <Plus size={18} strokeWidth={2.4} />
            סיור חדש
          </Link>
        </div>
      )}

      {tours.length > 0 && (
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {tours.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted"
            >
              <Link href={`/admin/tour/${t.id}`} className="min-w-0">
                <p className="truncate text-body font-semibold text-foreground">{t.title}</p>
                <p className="text-caption text-muted-foreground" dir="ltr">/tour/{t.slug}</p>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/tour/${t.id}`}
                  className="rounded-full bg-foreground px-4 py-2 text-caption font-medium text-background transition-opacity hover:opacity-85"
                >
                  עריכה
                </Link>
                <Link
                  href={`/tour/${t.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-caption font-medium text-foreground transition-colors hover:bg-muted"
                >
                  צפייה
                  <ExternalLink size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
