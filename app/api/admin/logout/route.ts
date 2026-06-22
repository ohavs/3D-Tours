// ============================================================
// POST /api/admin/logout — מנקה את עוגיית ההזדהות ומחזיר לכניסה.
// ============================================================

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url), {
    status: 303,
  })
  res.cookies.set('admin', '', { path: '/', maxAge: 0 })
  return res
}
