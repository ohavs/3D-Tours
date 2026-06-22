// ============================================================
// POST /api/upload — מחזיר URL חתום להעלאה ישירה ל-R2 (אדמין בלבד).
// הדפדפן מעלה את הקובץ ל-uploadUrl, ואז משתמש ב-url הציבורי.
// ============================================================

import { NextResponse } from 'next/server'
import { presignUpload } from '@/lib/r2'
import { isAuthed } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
  }
  try {
    const body = await req.json().catch(() => ({}))
    const tourId = String(body.tourId ?? 'misc').replace(/[^a-zA-Z0-9-]/g, '')
    const contentType = String(body.contentType ?? 'image/jpeg')
    const ext = (contentType.split('/')[1] || 'jpg').replace(/[^a-z0-9]/gi, '')

    const key = `tours/${tourId}/${crypto.randomUUID()}.${ext}`
    const { uploadUrl, url } = await presignUpload(key, contentType)
    return NextResponse.json({ uploadUrl, url })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
