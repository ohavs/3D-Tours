'use client'

// ============================================================
// components/NavBar.tsx
// פס ניווט עליון נקי (סגנון Steep): רקע לבן, לוגו בצד, קישורים,
// וכפתור פעולה כהה יחיד (pill). דביק לראש העמוד עם מסגרת דקה.
//
// 'use client' + usePathname: כדי להסתיר את הניווט בדפי הסיור
// (/tour/...) שבהם ה-Viewer תופס את כל המסך.
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  // בדפי הסיור — אין פס ניווט (לא להסתיר את התצוגה)
  if (pathname?.startsWith('/tour/')) return null

  return (
    <header className="sticky top-0 z-50 border-b border-dove/40 bg-pure-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* לוגו */}
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-full border-2 border-ink"
          />
          <span className="text-body font-semibold text-ink">סיורים 360°</span>
        </Link>

        {/* קישורים + כפתור פעולה כהה יחיד */}
        <nav className="flex items-center gap-5">
          <Link
            href="/"
            className="text-body text-ash transition hover:text-ink"
          >
            בית
          </Link>
          <Link
            href="/tour/test"
            className="rounded-full bg-ink px-5 py-2 text-caption font-medium text-pure-white transition hover:opacity-90"
          >
            צפו בסיור לדוגמה
          </Link>
        </nav>
      </div>
    </header>
  )
}
