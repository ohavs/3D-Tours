'use client'

// ============================================================
// components/HeroShowcase.tsx
// מוקאפ דשבורד כ-hero (Ventriloc): כרטיסים לבנים על קנבס אפור,
// גרף שטח בכתום, ו-KPI עם מספרים מטפסים. הקו של הגרף "נמשך"
// בכניסה — אנימציה עדינה במקום ריחוף.
// ============================================================

import { motion } from 'framer-motion'
import { CountUp } from '@/components/anim'

export default function HeroShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="space-y-4"
    >
      {/* כרטיס גרף ראשי */}
      <div className="rounded-lg border border-slate/15 bg-paper p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-caption font-medium text-graphite">
            צפיות בסיורים
          </span>
          <span className="rounded-full bg-fog px-3 py-1 text-[13px] text-slate">
            30 ימים
          </span>
        </div>

        <svg
          viewBox="0 0 280 96"
          className="mt-4 h-32 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff682c" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ff682c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* שטח */}
          <motion.path
            d="M0,72 L40,58 L80,64 L120,40 L160,48 L200,24 L240,30 L280,12 L280,96 L0,96 Z"
            fill="url(#fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          />
          {/* קו */}
          <motion.path
            d="M0,72 L40,58 L80,64 L120,40 L160,48 L200,24 L240,30 L280,12"
            fill="none"
            stroke="#202020"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, ease: 'easeInOut', delay: 0.5 }}
          />
        </svg>
      </div>

      {/* שני כרטיסי KPI */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate/15 bg-paper p-5 shadow-soft">
          <span className="text-caption font-medium text-graphite">
            סה״כ צפיות
          </span>
          <p className="mt-2 font-display text-heading-sm font-extrabold text-carbon">
            <CountUp to={12480} />
          </p>
          <span className="mt-1 inline-block text-[13px] font-medium text-signal">
            ▲ 24% החודש
          </span>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-slate/15 bg-paper p-5 shadow-soft">
          <Donut />
          <div>
            <span className="text-caption font-medium text-graphite">
              המרה ללידים
            </span>
            <p className="mt-1 font-display text-subheading font-extrabold text-carbon">
              34%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Donut() {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <svg width="58" height="58" viewBox="0 0 58 58">
      <circle cx="29" cy="29" r={r} fill="none" stroke="#efefef" strokeWidth="7" />
      <motion.circle
        cx="29"
        cy="29"
        r={r}
        fill="none"
        stroke="#ff682c"
        strokeWidth="7"
        strokeLinecap="round"
        transform="rotate(-90 29 29)"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * (1 - 0.34) }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
      />
    </svg>
  )
}
