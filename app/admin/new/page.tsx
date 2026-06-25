// ============================================================
// app/admin/new/page.tsx — יצירת סיור חדש (מוגן).
// ============================================================

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { isAuthed } from '@/lib/auth'
import NewTourForm from '@/components/NewTourForm'

export const dynamic = 'force-dynamic'

export default async function NewTourPage() {
  if (!(await isAuthed())) redirect('/admin/login')

  return (
    <main className="mx-auto max-w-[600px] px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-caption font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight size={16} />
        חזרה לדאשבורד
      </Link>
      <h1 className="mt-5 font-display text-heading-sm font-extrabold text-foreground">
        סיור חדש
      </h1>
      <p className="mt-1 text-caption text-muted-foreground">
        אחרי היצירה נוסיף חדרים ונקודות ניווט בעורך.
      </p>
      <div className="mt-8">
        <NewTourForm />
      </div>
    </main>
  )
}
