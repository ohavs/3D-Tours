// ============================================================
// lib/auth.ts
// בדיקת הזדהות פשוטה לאזור הניהול — מבוססת עוגייה מול ADMIN_SECRET.
// ============================================================

import { cookies } from 'next/headers'

export async function isAuthed(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return false
  const store = await cookies()
  return store.get('admin')?.value === secret
}
