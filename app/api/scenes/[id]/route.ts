// ============================================================
// PATCH /api/scenes/[id] — עדכון סצנה (כותרת / סדר / hotspots).
// DELETE /api/scenes/[id] — מחיקת סצנה (+ הקובץ ב-R2 כמיטב היכולת).
// אדמין בלבד.
// ============================================================

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthed } from '@/lib/auth'
import { deleteObject } from '@/lib/r2'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    const body = await req.json().catch(() => ({}))
    const update: Record<string, unknown> = {}
    if (body.title !== undefined) update.title = String(body.title)
    if (body.order_index !== undefined) update.order_index = Number(body.order_index)
    if (body.hotspots !== undefined) update.hotspots = body.hotspots

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tour_scenes')
      .update(update)
      .eq('id', id)
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

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    const supabase = createServiceClient()

    // ננסה למחוק את הקובץ מ-R2 (נחלץ את ה-key מה-URL הציבורי)
    const { data: scene } = await supabase
      .from('tour_scenes')
      .select('image_url')
      .eq('id', id)
      .single()
    const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim()
    if (scene?.image_url && base && scene.image_url.startsWith(base)) {
      const key = scene.image_url.slice(base.length + 1)
      try {
        await deleteObject(key)
      } catch {
        /* לא קריטי אם נכשל */
      }
    }

    const { error } = await supabase.from('tour_scenes').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
