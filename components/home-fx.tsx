'use client'

// ============================================================
// components/home-fx.tsx — אפקטי הגלילה של דף הבית (נבחרו במעבדה):
//   ExperienceBand — גרדיאנט חם רציף + זוהר כתום (אפקט 1)
//   StatsGhost     — מספרים עם כיתוב-רפאים "360°" ב-parallax (אפקט 2)
//   ProcessThread  — "איך זה עובד" עם חוט כתום שמצייר את עצמו (אפקט 3)
//   WipeDivider    — מעבר עם פאנל כתום אלכסוני (אפקט 4)
// ============================================================

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { CalendarCheck, Camera, Boxes, Link2 } from 'lucide-react'
import { CountUp } from '@/components/anim'

const ACCENT = '#ff682c'

// ── אפקט 1: באנד חוויה — גרדיאנט חם רציף ──
// הקטעים אסימטריים: מתכהה מהר יחסית, *נשאר כהה*, וחוזר לאט (החזרה
// לבהיר נמתחת על פני המחצית האחרונה כדי שלא תרגיש מהירה).
export function ExperienceBand({ title, subcopy }: { title: string; subcopy: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const stops = [0, 0.3, 0.48, 1]
  const bg = useTransform(scrollYProgress, stops, ['#ffffff', '#140f0b', '#140f0b', '#ffffff'])
  const color = useTransform(scrollYProgress, stops, ['#0a0a0a', '#fff3ea', '#fff3ea', '#0a0a0a'])
  const sub = useTransform(scrollYProgress, stops, ['#6b6b6b', '#ffd9c4', '#ffd9c4', '#6b6b6b'])
  const glow = useTransform(scrollYProgress, stops, [0, 0.6, 0.6, 0])

  return (
    <motion.section
      ref={ref}
      style={{ background: bg, color }}
      className="relative grid min-h-screen place-items-center overflow-hidden px-6"
    >
      <motion.div aria-hidden style={{ opacity: glow }} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: `radial-gradient(60% 55% at 50% 45%, ${ACCENT}55, transparent 70%)` }} />
      </motion.div>
      <div className="relative max-w-3xl text-center">
        <h2
          className="font-display font-black leading-[0.92]"
          style={{ fontSize: 'clamp(2.6rem,8vw,7rem)', letterSpacing: '-0.04em', whiteSpace: 'pre-line' }}
        >
          {title}
        </h2>
        <motion.p style={{ color: sub }} className="mx-auto mt-7 max-w-xl text-body-lg leading-relaxed">
          {subcopy}
        </motion.p>
      </div>
    </motion.section>
  )
}

// ── אפקט 2: מספרים עם כיתוב-רפאים "360°" ב-parallax ──
export function StatsGhost() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const ghostY = useTransform(scrollYProgress, [0, 1], ['22%', '-22%'])
  const ghostX = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section id="service" ref={ref} className="relative overflow-hidden">
      <motion.span
        aria-hidden
        style={{ y: ghostY, x: ghostX, color: ACCENT }}
        className="pointer-events-none absolute -top-[6vw] right-0 select-none font-display font-black leading-none opacity-[0.07]"
      >
        <span style={{ fontSize: '34vw' }}>360°</span>
      </motion.span>

      <div className="relative mx-auto grid max-w-[1240px] gap-y-10 px-6 py-28 sm:grid-cols-3 sm:divide-x sm:divide-border sm:rtl:divide-x-reverse">
        {[
          { v: <CountUp to={2.7} decimals={1} suffix="×" />, l: 'יותר זמן צפייה מול תמונות רגילות' },
          { v: (<>24<span className="text-accent">/</span>7</>), l: 'הנכס פתוח לביקור, מכל מכשיר' },
          { v: <CountUp to={48} suffix=" שעות" />, l: 'מהצילום ועד סיור מוכן' },
        ].map((s, i) => (
          <div key={i} className="group sm:px-8 sm:first:pr-0">
            <p className="font-display text-heading-lg font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent">
              {s.v}
            </p>
            <p className="mt-2 text-body text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── אפקט 3: "איך זה עובד" עם חוט כתום ──
const STEPS = [
  { icon: CalendarCheck, t: 'תיאום', d: 'קובעים מועד שנוח לך. אני מגיע עם כל הציוד.', at: 0.16 },
  { icon: Camera, t: 'צילום', d: 'סריקת 360° מלאה של כל החדרים — שעה־שעתיים בנכס.', at: 0.42 },
  { icon: Boxes, t: 'בנייה', d: 'מחבר את החדרים לסיור אינטראקטיבי חלק.', at: 0.68 },
  { icon: Link2, t: 'מסירה', d: 'לינק ייחודי וקוד הטמעה — תוך 48 שעות.', at: 0.92 },
]

export function ProcessThread() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const d0 = useTransform(scrollYProgress, [STEPS[0].at - 0.03, STEPS[0].at], [0.25, 1])
  const d1 = useTransform(scrollYProgress, [STEPS[1].at - 0.03, STEPS[1].at], [0.25, 1])
  const d2 = useTransform(scrollYProgress, [STEPS[2].at - 0.03, STEPS[2].at], [0.25, 1])
  const d3 = useTransform(scrollYProgress, [STEPS[3].at - 0.03, STEPS[3].at], [0.25, 1])
  const scales: MotionValue<number>[] = [d0, d1, d2, d3]

  return (
    <section ref={ref} className="mx-auto max-w-[1240px] px-6 py-24">
      <h2 className="mb-16 font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg">
        איך זה עובד
      </h2>
      <div className="relative pr-12">
        {/* קו רקע */}
        <div className="absolute right-[7px] top-2 h-[calc(100%-1rem)] w-[3px] bg-border" />
        {/* חוט כתום שמצייר את עצמו */}
        <motion.div
          style={{ scaleY: scrollYProgress, background: ACCENT }}
          className="absolute right-[7px] top-2 h-[calc(100%-1rem)] w-[3px] origin-top"
        />
        <div className="space-y-16">
          {STEPS.map((s, i) => (
            <div key={i} className="relative">
              <motion.span
                style={{ scale: scales[i], background: ACCENT }}
                className="absolute -right-[44px] top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-background"
              />
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
                  <s.icon size={22} />
                </span>
                <div>
                  <h3 className="font-display text-subheading font-bold text-foreground">{s.t}</h3>
                  <p className="mt-1.5 max-w-md text-body text-muted-foreground">{s.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
