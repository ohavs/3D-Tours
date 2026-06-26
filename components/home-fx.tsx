'use client'

// ============================================================
// components/home-fx.tsx — אפקטי הגלילה של דף הבית (נבחרו במעבדה):
//   ExperienceBand — גרדיאנט חם רציף + זוהר כתום, מודע-מצב (אפקט 1).
//   AboutSplit     — "קצת עליי" כסקשן מפוצל (פאנל היפוך-מצב מרוכך).
//   StatsGhost     — מספרים עם כיתוב-רפאים "360°" ב-parallax (אפקט 2).
//   ProcessThread  — "איך זה עובד" ענק: אייקונים מונפשים (react-useanimations)
//                    + כותרות בהקלדה עם גל-צבע כתום, הכל מונפש בכניסה לתצוגה.
//   TypeColorText  — הקלדת טקסט עם גל צביעה כתום הדרגתי.
//   ParallaxGhost  — כיתוב-רפאים כתום ב-parallax לרקע סקשנים תחתונים.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useTheme } from 'next-themes'
import { CalendarCheck, Aperture, Boxes, Link2, Check, type LucideIcon } from 'lucide-react'
import { CountUp } from '@/components/anim'

// react-useanimations נטען רק בצד-לקוח (lottie נשען על DOM)
const UseAnimations = dynamic(() => import('react-useanimations'), { ssr: false })
import calendar from 'react-useanimations/lib/calendar'
import settings from 'react-useanimations/lib/settings'
import share from 'react-useanimations/lib/share'

const ACCENT = '#ff682c'
const EASE = [0.22, 1, 0.36, 1] as const

// פלטות מודעות-מצב: ה"שיא" של הבאנד הוא תמיד ההפך מקנבס הדף.
const PALETTE = {
  light: { base: '#ffffff', peak: '#140f0b', baseTx: '#0a0a0a', peakTx: '#fff3ea', baseSub: '#6b6b6b', peakSub: '#ffd9c4' },
  dark: { base: '#0a0a0a', peak: '#f7f1ea', baseTx: '#fafafa', peakTx: '#1a1410', baseSub: '#a3a3a3', peakSub: '#5a4d40' },
}

// ════════ הקלדה + גל צביעה כתום הדרגתי ════════
// כל אות נחשפת בתורה (הקלדה), מתחילה בכתום ומתיישבת לצבע הסופי —
// יוצרת "גל" כתום שרץ אחרי ראש ההקלדה.
export function TypeColorText({
  text,
  className,
  finalColor = 'var(--foreground)',
  stagger = 0.05,
  delay = 0,
  start = true,
  caret = true,
}: {
  text: string
  className?: string
  finalColor?: string
  stagger?: number
  delay?: number
  start?: boolean
  caret?: boolean
}) {
  const chars = Array.from(text)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!start) return
    setTyping(true)
    const ms = (delay + chars.length * stagger) * 1000 + 650
    const t = setTimeout(() => setTyping(false), ms)
    return () => clearTimeout(t)
  }, [start, chars.length, stagger, delay])

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      animate={start ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      style={{ display: 'inline-block', direction: 'rtl' }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={{
            hidden: { opacity: 0, y: '0.32em' },
            show: {
              opacity: 1,
              y: 0,
              color: [ACCENT, ACCENT, finalColor],
              transition: { duration: 0.5, times: [0, 0.35, 1], ease: 'easeOut' },
            },
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {c}
        </motion.span>
      ))}
      {caret && typing && (
        <span
          aria-hidden
          className="ml-1 inline-block h-[0.82em] w-[3px] translate-y-[0.12em] animate-pulse rounded-full align-middle"
          style={{ background: ACCENT }}
        />
      )}
    </motion.span>
  )
}

// ── אפקט 1: באנד חוויה — גרדיאנט חם רציף, מודע-מצב ──
export function ExperienceBand({ title, subcopy }: { title: string; subcopy: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const { resolvedTheme } = useTheme()
  const pal = resolvedTheme === 'dark' ? PALETTE.dark : PALETTE.light

  // הסקשן גבוה (150vh) כדי לתת מרחק גלילה — המעבר נכנס ויוצא בקצב מאוזן,
  // עם "החזקה" כהה ארוכה באמצע בזמן שהטקסט ממורכז (סימטרי סביב 0.5).
  const stops = [0, 0.32, 0.68, 1]
  const bg = useTransform(scrollYProgress, stops, [pal.base, pal.peak, pal.peak, pal.base])
  const color = useTransform(scrollYProgress, stops, [pal.baseTx, pal.peakTx, pal.peakTx, pal.baseTx])
  const sub = useTransform(scrollYProgress, stops, [pal.baseSub, pal.peakSub, pal.peakSub, pal.baseSub])
  const glow = useTransform(scrollYProgress, stops, [0, 0.6, 0.6, 0])

  return (
    <motion.section
      ref={ref}
      style={{ background: bg, color }}
      className="relative grid min-h-[150vh] place-items-center overflow-hidden px-6"
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

// ── "קצת עליי" — סקשן מפוצל (פאנל היפוך-מצב כקלף מרוכך, בלי חיתוך חד) ──
const ABOUT_POINTS = ['מגיע אליך עם כל הציוד', 'סריקת 360° מלאה של הנכס', 'מסירה תוך 48 שעות']

export function AboutSplit() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-14 sm:py-24">
      <div className="mx-auto grid max-w-[1340px] items-stretch gap-9 px-5 sm:gap-16 sm:px-6 md:grid-cols-2">
        {/* פאנל היפוך-מצב — קלף מעוגל עם פינות רכות (בלי קצוות חדים) */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
          className="relative flex items-center justify-center overflow-hidden rounded-[2rem] bg-foreground px-8 py-24 sm:rounded-[2.8rem] sm:px-14 sm:py-28 md:min-h-[86vh]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(65% 55% at 72% 30%, ${ACCENT}2e, transparent 72%)` }}
          />
          <div className="relative max-w-md text-center md:text-right">
            <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.2em] text-background/55">
              <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
              מי מאחורי העדשה
            </span>
            <h2
              className="mt-6 font-display font-black leading-[0.82] text-background"
              style={{ fontSize: 'clamp(4rem,13vw,10.5rem)', letterSpacing: '-0.05em' }}
            >
              קצת
              <br />
              עליי<span style={{ color: ACCENT }}>.</span>
            </h2>
          </div>
        </motion.div>

        {/* פאנל קנבס-הדף — טקסט + נקודות מפתח */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
          className="flex items-center px-2 sm:px-6 md:py-10"
        >
          <div className="max-w-lg">
            <p className="font-display text-subheading font-bold leading-snug text-foreground sm:text-[2rem] sm:leading-[1.25]">
              אני מצלם נכסים והופך אותם לסיורים וירטואליים 360° — שירות מלא מקצה לקצה.
            </p>
            <p className="mt-6 text-body-lg leading-relaxed text-muted-foreground sm:text-subheading">
              מגיע אליך, סורק את הנכס, ובונה את הסיור עד שהוא מוכן להטמעה — עם לינק וקוד מוכן לאתר שלך.
            </p>
            <ul className="mt-10 space-y-5">
              {ABOUT_POINTS.map((t) => (
                <li key={t} className="flex items-center gap-4 text-body-lg font-medium text-foreground sm:text-subheading">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${ACCENT}1f` }}
                  >
                    <Check size={18} strokeWidth={3} style={{ color: ACCENT }} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
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

// ════════ אפקט 3: "איך זה עובד" — ענק, עם אייקונים מונפשים ════════
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LottieAnim = any
type Step = { anim?: LottieAnim; speed?: number; camera?: boolean; fallback: LucideIcon; t: string; d: string }
const STEPS: Step[] = [
  { anim: calendar, speed: 0.3, fallback: CalendarCheck, t: 'תיאום', d: 'קובעים מועד שנוח לך, ואני מגיע עם כל הציוד עד הדלת.' },
  { camera: true, fallback: Aperture, t: 'צילום', d: 'סריקת 360° מלאה של כל החדרים — שעה־שעתיים בנכס, ואני זז.' },
  { anim: settings, speed: 0.8, fallback: Boxes, t: 'בנייה', d: 'מחבר את כל החדרים לסיור אינטראקטיבי אחד, חלק וזורם.' },
  { anim: share, speed: 0.9, fallback: Link2, t: 'מסירה', d: 'לינק ייחודי וקוד הטמעה מוכן לאתר — אצלך תוך 48 שעות.' },
]

// אייקון "צילום": עדשת מצלמה (Aperture) שמסתובבת לאט ברציפות —
// תחושת מיקוד/עדשה, מתכתב עם סריקת 360°. (ל-react-useanimations אין מצלמה.)
function CameraLens() {
  return (
    <motion.div
      className="text-foreground"
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    >
      <Aperture className="h-12 w-12 sm:h-16 sm:w-16" strokeWidth={1.6} />
    </motion.div>
  )
}

function StepRow({ step }: { step: (typeof STEPS)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-25%' })
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const Fallback = step.fallback

  // מילוי הצומת מונע-גלילה: חלול כשהוא מתחת, מתמלא בכתום כשהחוט מגיע אליו.
  const { scrollYProgress: dotP } = useScroll({ target: dotRef, offset: ['start 0.82', 'start 0.5'] })
  const fillBg = useTransform(dotP, [0, 1], ['rgba(255,104,44,0)', 'rgba(255,104,44,1)'])
  const fillBorder = useTransform(dotP, [0, 1], ['rgba(255,104,44,0.3)', 'rgba(255,104,44,1)'])
  const fillScale = useTransform(dotP, [0, 1], [0.72, 1])

  return (
    <div ref={ref} className="relative pr-16 sm:pr-24">
      {/* נקודת ציר — טבעת חלולה שמתמלאת בכתום ככל שהגלילה מגיעה אליה (right:30px) */}
      <span ref={dotRef} className="absolute right-[19px] top-10 -translate-y-1/2 sm:top-14">
        <motion.span
          style={{ backgroundColor: fillBg, borderColor: fillBorder, scale: fillScale }}
          className="block h-[22px] w-[22px] rounded-full border-[3px] ring-4 ring-background"
        />
      </span>

      <div className="flex items-start gap-5 sm:gap-9">
        {/* קופסת אייקון מונפש */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 14 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-muted text-foreground sm:h-28 sm:w-28"
        >
          {step.camera ? (
            <CameraLens />
          ) : mounted && inView ? (
            <span className="[&_svg]:!h-12 [&_svg]:!w-12 sm:[&_svg]:!h-16 sm:[&_svg]:!w-16">
              <UseAnimations animation={step.anim} size={64} strokeColor="currentColor" autoplay loop speed={step.speed ?? 1} />
            </span>
          ) : (
            <Fallback className="h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.6} />
          )}
        </motion.div>

        {/* כותרת בהקלדה + תיאור */}
        <div className="pt-1.5 sm:pt-4">
          <TypeColorText
            text={step.t}
            start={inView}
            stagger={0.07}
            className="block font-display text-[clamp(2.1rem,5.5vw,4rem)] font-black leading-[0.95] tracking-tight"
          />
          <p className="mt-3 max-w-xl text-body leading-relaxed text-muted-foreground sm:mt-4 sm:text-subheading">
            {step.d}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ProcessThread() {
  const ref = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const headIn = useInView(headRef, { once: true, margin: '-20%' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })

  return (
    <section ref={ref} className="mx-auto max-w-[1320px] px-6 py-28 sm:py-40">
      <h2
        ref={headRef}
        className="mb-16 font-display font-black leading-[0.95] tracking-tight text-foreground sm:mb-28"
        style={{ fontSize: 'clamp(2.6rem,8vw,6.5rem)', letterSpacing: '-0.04em' }}
      >
        <TypeColorText text="איך זה עובד" start={headIn} stagger={0.06} className="font-display" />
      </h2>

      <div className="relative">
        {/* מסילת רקע — ממורכזת על right:30px */}
        <div className="absolute right-[29px] top-10 bottom-10 w-[2px] bg-border" />
        {/* חוט כתום שמצייר את עצמו — אותו ציר בדיוק */}
        <motion.div
          style={{ scaleY: scrollYProgress, background: ACCENT }}
          className="absolute right-[29px] top-10 bottom-10 w-[2px] origin-top"
        />
        <div className="space-y-20 sm:space-y-32">
          {STEPS.map((s, i) => (
            <StepRow key={i} step={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── כיתוב-רפאים כתום ב-parallax (רקע לסקשנים התחתונים) ──
export function ParallaxGhost({
  text,
  size = '30vw',
  position = 'left',
}: {
  text: string
  size?: string
  position?: 'left' | 'right' | 'center'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['16%', '-16%'])
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  const place =
    position === 'right'
      ? 'right-[-4vw] top-1/2 -translate-y-1/2'
      : position === 'center'
        ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        : 'left-[-4vw] top-1/2 -translate-y-1/2'

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.span
        style={{ y, x, color: ACCENT }}
        className={`absolute select-none font-display font-black leading-none opacity-[0.05] ${place}`}
      >
        <span style={{ fontSize: size }}>{text}</span>
      </motion.span>
    </div>
  )
}
