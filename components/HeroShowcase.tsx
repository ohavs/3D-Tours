'use client'

// ============================================================
// components/HeroShowcase.tsx
// "מוקאפ" מוצר ל-hero — לוח ניהול סיורים בשפת העיצוב של הרפרנס:
// מפת נכסים כהה עם סיכות, כרטיסי סטטיסטיקה, וגרף קטן.
// מתנייע עם הגלילה (parallax עדין) — לא ריחוף, אלא תנועה לפי scroll.
// ============================================================

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Search, SlidersHorizontal, MapPin, TrendingUp, Eye, Users } from 'lucide-react'
import { CountUp } from '@/components/anim'

export default function HeroShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // ככל שגוללים — הכרטיס נע מעט מעלה ומתכווץ קלות (עומק, לא ריחוף)
  const y = useTransform(scrollYProgress, [0, 1], [0, -70])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.55])

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        style={{ y, scale, opacity }}
        className="mx-auto max-w-5xl rounded-3xl border border-dove/70 bg-pure-white p-3 shadow-card sm:p-4"
      >
        {/* פס עליון */}
        <div className="flex items-center justify-between gap-3 px-1 pb-3">
          <div className="flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-caption text-graphite">
            <Search size={16} />
            <span>חפש נכס, עיר או כתובת</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-dove px-3 py-2 text-caption text-ash">
              <SlidersHorizontal size={15} /> אחרונים
            </span>
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-green to-green-strong" />
          </div>
        </div>

        {/* מפת נכסים כהה עם סיכות */}
        <div className="relative h-56 overflow-hidden rounded-2xl bg-ink sm:h-64">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '38px 38px',
            }}
          />
          <span className="absolute left-[12%] top-[55%] h-16 w-32 -rotate-12 rounded-full bg-green/20 blur-xl" />
          {[
            { top: '24%', left: '22%' },
            { top: '58%', left: '40%' },
            { top: '38%', left: '64%' },
            { top: '68%', left: '78%' },
            { top: '30%', left: '85%' },
          ].map((p, i) => (
            <motion.span
              key={i}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-pure-white shadow-soft"
              style={{ top: p.top, left: p.left }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            >
              <MapPin size={16} className="text-green" strokeWidth={2.5} />
            </motion.span>
          ))}
        </div>

        {/* שורת כרטיסי נתונים */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatMini
            icon={<Eye size={16} />}
            label="צפיות החודש"
            value={<CountUp to={12480} />}
            delta="+24%"
          />
          <StatMini
            icon={<Users size={16} />}
            label="לידים"
            value={<CountUp to={128} />}
            delta="+11%"
          />
          <StatMini
            icon={<TrendingUp size={16} />}
            label="סיורים פעילים"
            value={<CountUp to={34} />}
            delta="+3"
            chart
          />
        </div>
      </motion.div>
    </div>
  )
}

function StatMini({
  icon,
  label,
  value,
  delta,
  chart = false,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  delta: string
  chart?: boolean
}) {
  return (
    <div className="rounded-2xl border border-dove/70 bg-pure-white p-4">
      <div className="flex items-center gap-2 text-graphite">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-soft text-green">
          {icon}
        </span>
        <span className="text-caption">{label}</span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-subheading font-bold text-ink">{value}</span>
        {chart ? (
          <Sparkline />
        ) : (
          <span className="rounded-full bg-green-soft px-2 py-0.5 text-[12px] font-semibold text-green-strong">
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}

function Sparkline() {
  return (
    <svg width="64" height="26" viewBox="0 0 64 26" fill="none">
      <polyline
        points="0,20 12,14 24,17 36,8 48,11 64,3"
        stroke="#19c853"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
