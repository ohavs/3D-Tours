'use client'

// ============================================================
// components/NavBar.tsx — נאבר נקי בהשראת Eden:
// לוגו, קישורים במרכז, ושני כפתורי-פיל (כהה + מתאר).
// מוסתר בדפי הסיור (/tour/...).
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '#features', label: 'יכולות' },
  { href: '#how', label: 'איך זה עובד' },
  { href: '#tours', label: 'דוגמאות' },
]

export default function NavBar() {
  const pathname = usePathname()
  if (pathname?.startsWith('/tour/')) return null

  return (
    <header className="sticky top-0 z-50 border-b border-dove/70 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-6">
        {/* לוגו */}
        <Link
          href="/"
          className="text-[22px] font-extrabold tracking-tight text-ink"
        >
          tour<span className="text-graphite">360</span>
        </Link>

        {/* קישורים במרכז */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-caption font-medium text-ash transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* כפתורים */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/tour/test"
            className="rounded-full bg-ink px-5 py-2.5 text-caption font-semibold text-pure-white transition-opacity hover:opacity-85"
          >
            סיור לדוגמה
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-dove px-5 py-2.5 text-caption font-semibold text-ink transition-colors hover:bg-mist"
          >
            כניסה
          </Link>
        </div>
      </div>
    </header>
  )
}
