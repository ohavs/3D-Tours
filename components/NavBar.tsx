'use client'

// ============================================================
// components/NavBar.tsx
// ניווט "גלולה" צף — אי כהה שמרחף במרכז־עליון של הדף.
// זהו אלמנט החתימה של מערכת העיצוב: לא פס מלא־רוחב, אלא גלולה
// קומפקטית עם צל רך.
//
// 'use client' + usePathname: כדי שנוכל להסתיר את הניווט בדפי
// הסיור (/tour/...) שבהם ה-Viewer תופס את כל המסך.
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  // בדפי הסיור — אין ניווט צף (שלא יסתיר את התצוגה)
  if (pathname?.startsWith('/tour/')) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="pointer-events-auto flex items-center gap-1 rounded-nav bg-graphite-night px-3 py-2 text-paper shadow-nav">
        {/* לוגו + שם */}
        <Link href="/" className="flex items-center gap-2 px-2">
          <span
            aria-hidden
            className="inline-block h-4 w-4 rounded-full border border-paper"
          />
          <span className="text-body-sm font-medium">סיורים 360°</span>
        </Link>

        {/* פריט ניווט */}
        <Link
          href="/"
          className="rounded-button px-3 py-1.5 text-body-sm text-paper/75 transition hover:text-paper"
        >
          בית
        </Link>

        {/* כפתור פעולה כהה (ghost) — רדיוס קטן בכוונה */}
        <Link
          href="/tour/test"
          className="flex items-center gap-1 rounded-button bg-obsidian px-3 py-1.5 text-body-sm font-medium text-paper transition hover:opacity-90"
        >
          סיור לדוגמה <span aria-hidden>←</span>
        </Link>
      </nav>
    </div>
  )
}
