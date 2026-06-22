// ============================================================
// app/api/tours/route.ts
// GET /api/tours — מחזיר את רשימת הסיורים ממסד הנתונים.
// משמש גם כבדיקה שחיבור Supabase עובד (יחזיר [] אם אין סיורים).
// ============================================================

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthed } from '@/lib/auth'

// דינמי — נקרא בזמן ריצה, לא בזמן build
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message, hint: error.hint, code: error.code },
        { status: 500 },
      )
    }
    return NextResponse.json({ tours: data ?? [] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

// POST /api/tours — יצירת סיור חדש (מוגן בהזדהות אדמין)
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
  }
  try {
    const body = await req.json().catch(() => ({}))
    const title = String(body.title ?? '').trim()
    let slug = String(body.slug ?? '').trim().toLowerCase()

    if (!title) {
      return NextResponse.json({ error: 'שם הסיור חובה' }, { status: 400 })
    }
    // slug תקין ל-URL; אם לא סופק — מזהה קצר אקראי
    slug = slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    if (!slug) slug = crypto.randomUUID().slice(0, 8)

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('tours')
      .insert({ title, slug })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ tour: data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
