// ============================================================
// app/api/tours/route.ts
// GET /api/tours — מחזיר את רשימת הסיורים ממסד הנתונים.
// משמש גם כבדיקה שחיבור Supabase עובד (יחזיר [] אם אין סיורים).
// ============================================================

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

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
