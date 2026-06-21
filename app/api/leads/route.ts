// ============================================================
// app/api/leads/route.ts
// POST /api/leads — שומר פניית "צור קשר" במסד הנתונים.
// ============================================================

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body.name ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!name) {
      return NextResponse.json({ error: 'שם הוא שדה חובה' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('leads')
      .insert({ name, phone, message })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
