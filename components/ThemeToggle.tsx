'use client'

// ============================================================
// components/ThemeToggle.tsx — מתג בהיר/כהה.
// אנימציית מעבר עדינה בין שמש לירח; נמנע מ-hydration mismatch.
// ============================================================

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? 'מצב בהיר' : 'מצב כהה'}
      onClick={() => {
        const next = isDark ? 'light' : 'dark'
        // מעבר חלק (crossfade) דרך View Transitions — מונפש וקליל ב-GPU,
        // בלי הלאג של transition על אלפי אלמנטים. נפילה חיננית בלי תמיכה.
        const doc = document as Document & { startViewTransition?: (cb: () => void) => void }
        if (doc.startViewTransition) {
          doc.startViewTransition(() => {
            document.documentElement.classList.toggle('dark', next === 'dark')
            setTheme(next)
          })
        } else {
          setTheme(next)
        }
      }}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted ${className}`}
    >
      {/* כדי למנוע הבהוב לפני hydration — מציגים אייקון ניטרלי */}
      {mounted ? (
        isDark ? <Moon size={17} /> : <Sun size={18} />
      ) : (
        <Sun size={18} className="opacity-0" />
      )}
    </button>
  )
}
