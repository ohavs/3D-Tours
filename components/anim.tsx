'use client'

// ============================================================
// components/anim.tsx
// עוטפי אנימציה לשימוש חוזר, מבוססי framer-motion.
// 'use client' כי אנימציות רצות בדפדפן בלבד.
//
// Reveal  — תוכן ש"נכנס" (דהייה + החלקה מלמטה) כשגוללים אליו.
// Float   — ריחוף עדין ואינסופי (לכרטיס התצוגה המקדימה).
// כל אלה <div> רגילים עם תנועה, אפשר להעביר להם className.
// ============================================================

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// עקומת easing רכה ("easeOutExpo") שנותנת תחושת תנועה יוקרתית
const EASE = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number // השהיה (לשרשור כניסה של כמה אלמנטים)
  y?: number // מרחק ההחלקה ההתחלתי
}

export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

interface FloatProps {
  children: ReactNode
  className?: string
  duration?: number
}

export function Float({ children, className, duration = 6 }: FloatProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
