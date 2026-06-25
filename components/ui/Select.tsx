'use client'

// ============================================================
// components/ui/Select.tsx — תפריט בחירה מעוצב (החלפה ל-<select>).
// נשלט במלואו: רשימה מונפשת, מצב נבחר, סגירה בלחיצה בחוץ / Escape.
// תומך בשני נושאים: 'light' (על רקע בהיר) ו-'dark' (על רקע כהה).
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  theme?: 'light' | 'dark'
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'בחר…',
  theme = 'light',
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const dark = theme === 'dark'

  return (
    <div ref={ref} className="relative" dir="rtl">
      {/* כפתור */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-caption transition-colors ${
          dark
            ? 'bg-white/10 text-paper hover:bg-white/15'
            : 'border border-border bg-surface text-foreground hover:border-border-strong'
        } ${open ? (dark ? 'ring-1 ring-accent' : 'border-border-strong') : ''}`}
      >
        <span className={selected ? '' : dark ? 'text-paper/40' : 'text-muted-foreground'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${
            dark ? 'text-paper/60' : 'text-muted-foreground'
          }`}
        />
      </button>

      {/* רשימה */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl p-1.5 shadow-card ${
              dark
                ? 'border border-white/10 bg-[#2b2b2b]'
                : 'border border-border bg-surface'
            }`}
          >
            {options.length === 0 && (
              <li className={`px-3 py-2 text-caption ${dark ? 'text-paper/40' : 'text-muted-foreground'}`}>
                אין אפשרויות
              </li>
            )}
            {options.map((o) => {
              const active = o.value === value
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-right text-caption transition-colors ${
                      dark
                        ? `text-paper hover:bg-white/10 ${active ? 'bg-white/10' : ''}`
                        : `text-foreground hover:bg-muted ${active ? 'bg-muted' : ''}`
                    }`}
                  >
                    <span className="truncate">{o.label}</span>
                    {active && <Check size={15} className="shrink-0 text-accent" />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
