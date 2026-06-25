// ============================================================
// app/admin/tour/[id]/page.tsx — עורך הסיור (מוגן).
// טוען את הסיור והסצנות ומציג את מנהל הסצנות.
// ============================================================

import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { isAuthed } from '@/lib/auth'
import ThemeToggle from '@/components/ThemeToggle'
import { createServiceClient } from '@/lib/supabase'
import type { Tour, TourScene } from '@/lib/types'
import SceneManager from '@/components/SceneManager'

export const dynamic = 'force-dynamic'

export default async function TourEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await isAuthed())) redirect('/admin/login')
  const { id } = await params

  const supabase = createServiceClient()
  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single()
  if (!tour) notFound()

  const { data: scenes } = await supabase
    .from('tour_scenes')
    .select('*')
    .eq('tour_id', id)
    .order('order_index', { ascending: true })

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-caption font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight size={16} />
        חזרה לדאשבורד
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-heading-sm font-extrabold text-foreground">
            {(tour as Tour).title}
          </h1>
          <p className="mt-1 text-caption text-muted-foreground" dir="ltr">
            /tour/{(tour as Tour).slug}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href={`/tour/${(tour as Tour).slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-caption font-medium text-foreground transition-colors hover:bg-muted"
          >
            צפייה בסיור
            <ExternalLink size={15} />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <SceneManager
          tourId={(tour as Tour).id}
          initialScenes={(scenes as TourScene[]) ?? []}
        />
      </div>
    </main>
  )
}
