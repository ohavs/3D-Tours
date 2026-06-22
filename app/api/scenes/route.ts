// ============================================================
// POST /api/scenes — יצירת סצנה (חדר) לסיור (אדמין בלבד).
// ============================================================

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthed } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
  }
  try {
    const body = await req.json().catch(() => ({}))
    const tour_id = String(body.tour_id ?? '')
    const title = String(body.title ?? '').trim() || 'חדר'
    const image_url = String(body.image_url ?? '')
    const order_index = Number(body.order_index ?? 0)

    if (!tour_id || !image_url) {
      return NextResponse.json(
        { error: 'tour_id ו-image_url חובה' },
        { status: 400 },
      )
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tour_scenes')
      .insert({ tour_id, title, image_url, order_index })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ scene: data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
