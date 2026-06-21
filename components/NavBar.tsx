'use client'

// ============================================================
// components/NavBar.tsx
// פס ניווט עליון נקי ומודרני: רקע בהיר עם טשטוש, מסגרת דקה,
// לוגו עם chip ירוק, קישורים, וכפתור פעולה ירוק (מגנטי).
// מוסתר בדפי הסיור (/tour/...) שבהם ה-Viewer במסך מלא.
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Aperture, ArrowLeft } from 'lucide-react'
import { Magnetic } from '@/components/anim'

export default function NavBar() {
  const pathname = usePathname()
  if (pathname?.startsWith('/tour/')) return null

  return (
    <header className="sticky top-0 z-50 border-b border-dove/60 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* לוגו */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green text-pure-white">
            <Aperture size={18} strokeWidth={2.2} />
          </span>
          <span className="text-body font-bold text-ink">סיורים 360°</span>
        </Link>

        {/* קישורים */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="#how"
            className="text-caption font-medium text-ash transition-colors hover:text-ink"
          >
            איך זה עובד
          </Link>
          <Link
            href="#features"
            className="text-caption font-medium text-ash transition-colors hover:text-ink"
          >
            יכולות
          </Link>
        </nav>

        {/* כפתור פעולה מגנטי */}
        <Magnetic>
          <Link
            href="/tour/test"
            className="flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-caption font-semibold text-pure-white shadow-green transition-colors hover:bg-green-strong"
          >
            סיור לדוגמה
            <ArrowLeft size={16} strokeWidth={2.4} />
          </Link>
        </Magnetic>
      </div>
    </header>
  )
}
