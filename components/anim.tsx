'use client'

// ============================================================
// components/anim.tsx — עוטפי אנימציה (framer-motion)
// Reveal  — חשיפה בכניסה לסקשן (וגם בטעינה, לתוכן שמעל הקיפול).
// CountUp — מספר שמטפס מ-0 ליעד כשנכנס לתצוגה.
// Spinner — אינדיקציית טעינה.
// ============================================================

import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
}: {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString('he-IL', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`spinner inline-block rounded-full border-2 border-slate/30 border-t-carbon ${className}`}
    />
  )
}
