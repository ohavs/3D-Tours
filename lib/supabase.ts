// ============================================================
// lib/supabase.ts
// יוצרים לקוחות Supabase לפי דרישה (lazy) כדי שה-build לא ייכשל
// אם משתני הסביבה עדיין לא מוגדרים בזמן הבנייה.
//
// - createAnonClient   → קריאות ציבוריות (כפוף ל-RLS)
// - createServiceClient → צד שרת בלבד (עוקף RLS) — לכתיבה/ניהול
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function createAnonClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars (anon) are missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars (service) are missing')
  return createClient(url, key, { auth: { persistSession: false } })
}
