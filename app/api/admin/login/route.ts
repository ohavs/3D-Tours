// ============================================================
// POST /api/admin/login — מאמת סיסמה מול ADMIN_SECRET ומציב עוגייה.
// ============================================================

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET?.trim()
  const body = await req.json().catch(() => ({}))
  const password = String(body.password ?? '')

  if (!secret || password !== secret) {
    return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin', secret, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 ימים
  })
  return res
}
