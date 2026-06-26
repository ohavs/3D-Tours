'use client'

// ============================================================
// app/lab/page.tsx — מעבדת אפקטים: הדגמה חיה של אפשרויות המעבר בין
// סקשנים (עם דגש על כתום). גוללים, חווים, ובוחרים מה לאמץ ב-"/".
// כל אפקט בבלוק נפרד עם מספר ושם.
// ============================================================

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ACCENT = '#ff682c'
const BASE = 'https://photo-sphere-viewer-data.netlify.app/assets/tour/'
const IMGS = [2, 3, 4, 5, 6, 7].map((i) => `${BASE}key-biscayne-${i}.jpg`)

function Label({ n, name }: { n: number; name: string }) {
  return (
    <div className="mb-6 inline-flex items-center gap-3">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-black text-white"
        style={{ background: ACCENT }}
      >
        {n}
      </span>
      <span className="text-[13px] font-bold uppercase tracking-[0.25em] opacity-70">
        {name}
      </span>
    </div>
  )
}

// ── אפקט 1: גרדיאנט חם רציף + זוהר כתום ──
function Effect1() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bg = useTransform(scrollYProgress, [0, 0.5, 1], ['#fff7f0', '#15100c', '#fff7f0'])
  const color = useTransform(scrollYProgress, [0, 0.5, 1], ['#1a1410', '#fff3ea', '#1a1410'])
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.55, 0])
  return (
    <motion.section
      ref={ref}
      style={{ background: bg, color }}
      className="relative grid min-h-screen place-items-center overflow-hidden px-6"
    >
      <motion.div
        aria-hidden
        style={{ opacity: glow }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(60% 50% at 50% 50%, ${ACCENT}55, transparent 70%)` }}
        />
      </motion.div>
      <div className="relative max-w-2xl text-center">
        <Label n={1} name="גרדיאנט חם רציף" />
        <h2 className="font-display font-black leading-[0.95]" style={{ fontSize: 'clamp(2.2rem,6vw,5rem)', letterSpacing: '-0.03em' }}>
          הרקע מתחמם ומתכהה
          <br />
          ברציפות בזמן הגלילה.
        </h2>
        <p className="mt-6 text-[18px] opacity-70">
          בלי קפיצה — מעבר חלק לגמרי, עם זוהר כתום שעולה ודועך באמצע.
        </p>
      </div>
    </motion.section>
  )
}

// ── אפקט 2: Parallax + כיתוב-רפאים כתום ──
function Effect2() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const ghostY = useTransform(scrollYProgress, [0, 1], ['25%', '-25%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  return (
    <section ref={ref} className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0e0e10] px-6 text-white">
      <motion.span
        aria-hidden
        style={{ y: ghostY, color: ACCENT }}
        className="pointer-events-none absolute select-none font-black opacity-[0.12]"
      >
        <span style={{ fontSize: '46vw', lineHeight: 1 }}>360°</span>
      </motion.span>
      <motion.div style={{ y: fgY }} className="relative max-w-2xl text-center">
        <Label n={2} name="עומק · Parallax" />
        <h2 className="font-display font-black leading-[0.95]" style={{ fontSize: 'clamp(2.2rem,6vw,5rem)', letterSpacing: '-0.03em' }}>
          שכבות שזזות
          <br />
          במהירויות שונות.
        </h2>
        <p className="mt-6 text-[18px] text-white/60">
          הכיתוב הענק הכתום ברקע נע לאט יותר מהטקסט — תחושת עומק תלת-ממדית.
        </p>
      </motion.div>
    </section>
  )
}

// ── אפקט 3: חוט כתום שמצייר את עצמו + נקודות ──
function Effect3() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  // 4 טרנספורמים מפורשים (ללא hooks בלולאה)
  const d0 = useTransform(scrollYProgress, [0.13, 0.15], [0.3, 1])
  const d1 = useTransform(scrollYProgress, [0.38, 0.4], [0.3, 1])
  const d2 = useTransform(scrollYProgress, [0.63, 0.65], [0.3, 1])
  const d3 = useTransform(scrollYProgress, [0.88, 0.9], [0.3, 1])
  const rows: { t: string; scale: MotionValue<number> }[] = [
    { t: 'תיאום', scale: d0 },
    { t: 'צילום', scale: d1 },
    { t: 'בנייה', scale: d2 },
    { t: 'מסירה', scale: d3 },
  ]
  return (
    <section ref={ref} className="relative min-h-[140vh] bg-[#fbf7f3] px-6 py-32 text-[#1a1410]">
      <div className="mx-auto max-w-2xl">
        <Label n={3} name="חוט כתום מחבר" />
        <div className="relative pr-10">
          {/* קו רקע */}
          <div className="absolute right-3 top-0 h-full w-[3px] bg-black/10" />
          {/* קו כתום שמצייר את עצמו */}
          <motion.div
            style={{ scaleY: scrollYProgress, background: ACCENT }}
            className="absolute right-3 top-0 h-full w-[3px] origin-top"
          />
          <div className="space-y-24">
            {rows.map((r, i) => (
              <div key={i} className="relative">
                <motion.span
                  style={{ scale: r.scale, background: ACCENT }}
                  className="absolute -right-[34px] top-1 h-4 w-4 rounded-full ring-4 ring-[#fbf7f3]"
                />
                <h3 className="font-display text-[34px] font-black">{r.t}</h3>
                <p className="mt-2 text-[17px] opacity-60">
                  הנקודה נדלקת בכתום והחוט מתמלא ככל שמתקדמים.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── אפקט 4: Wipe כתום שחוצה במעבר ──
function Effect4() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0.25, 0.5, 0.75], ['110%', '0%', '-110%'])
  const labelOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0])
  return (
    <section ref={ref} className="relative grid min-h-screen place-items-center overflow-hidden bg-[#fff] px-6 text-[#1a1410]">
      <div className="max-w-2xl text-center">
        <Label n={4} name="Wipe כתום" />
        <h2 className="font-display font-black leading-[0.95]" style={{ fontSize: 'clamp(2.2rem,6vw,5rem)', letterSpacing: '-0.03em' }}>
          פאנל כתום חוצה
          <br />
          את המסך במעבר.
        </h2>
        <p className="mt-6 text-[18px] opacity-60">כמו וילון שמחליק וחושף את הסקשן הבא.</p>
      </div>
      <motion.div
        aria-hidden
        style={{ x, background: ACCENT }}
        className="pointer-events-none absolute inset-0 -skew-x-6"
      >
        <motion.span
          style={{ opacity: labelOpacity }}
          className="absolute inset-0 grid skew-x-6 place-items-center font-display text-[14vw] font-black text-white/90"
        >
          360°
        </motion.span>
      </motion.div>
    </section>
  )
}

// ── אפקט 5: כותרת נצמדת + קו כתום שגדל ──
function Effect5() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const scaleX = useTransform(scrollYProgress, [0.1, 0.9], [0, 1])
  const wordColor = useTransform(scrollYProgress, [0.3, 0.7], ['#cfc7c0', '#1a1410'])
  return (
    <section ref={ref} className="relative h-[220vh] bg-[#f4efe9]">
      <div className="sticky top-0 grid h-screen place-items-center px-6 text-[#1a1410]">
        <div className="max-w-2xl text-center">
          <Label n={5} name="כותרת נצמדת + סימון גדל" />
          <motion.h2
            style={{ color: wordColor }}
            className="font-display font-black leading-[1]"
          >
            <span style={{ fontSize: 'clamp(2.4rem,7vw,6rem)', letterSpacing: '-0.03em' }}>
              חוויית מקום.
            </span>
          </motion.h2>
          <div className="mx-auto mt-4 h-2.5 w-[min(70vw,420px)] overflow-hidden rounded-full bg-black/10">
            <motion.div style={{ scaleX, background: ACCENT }} className="h-full w-full origin-right rounded-full" />
          </div>
          <p className="mt-6 text-[18px] opacity-60">הכותרת נשארת, והסימון הכתום מתמלא ככל שגוללים.</p>
        </div>
      </div>
    </section>
  )
}

// ── אפקט 6: גלריה אופקית מוצמדת ──
function Effect6() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-70%'])
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <section ref={ref} className="relative h-[320vh] bg-[#0e0e10]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="px-6 sm:px-12">
          <Label n={6} name="גלריה אופקית מוצמדת" />
        </div>
        <motion.div style={{ x }} className="flex gap-6 px-6 sm:px-12">
          {IMGS.map((src) => (
            <div key={src} className="relative h-[58vh] w-[78vw] shrink-0 overflow-hidden rounded-2xl sm:w-[44vw]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </motion.div>
        <div className="mx-6 mt-8 h-1.5 overflow-hidden rounded-full bg-white/15 sm:mx-12">
          <motion.div style={{ scaleX: bar, background: ACCENT }} className="h-full w-full origin-right" />
        </div>
        <p className="mt-4 px-6 text-[15px] text-white/50 sm:px-12">
          גלילה אנכית מזיזה את הגלריה אופקית, עם פס התקדמות כתום.
        </p>
      </div>
    </section>
  )
}

export default function Lab() {
  return (
    <main dir="rtl" className="bg-[#fff]">
      {/* בר עליון */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-black/70 px-5 py-3 text-white backdrop-blur-md">
        <span className="text-[14px] font-bold tracking-wide">מעבדת אפקטים · גלול וחווה</span>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[13px] font-bold text-black"
        >
          <ArrowRight size={15} /> חזרה לאתר
        </Link>
      </header>

      <div className="grid min-h-[60vh] place-items-center bg-[#fff7f0] px-6 pt-16 text-center text-[#1a1410]">
        <div className="max-w-xl">
          <h1 className="font-display font-black leading-[0.95]" style={{ fontSize: 'clamp(2.4rem,8vw,6rem)', letterSpacing: '-0.04em' }}>
            6 אפקטים.
            <br />
            תבחר.
          </h1>
          <p className="mt-6 text-[18px] opacity-60">
            גלול למטה — כל אפקט מודגם בנפרד עם מספר. תגיד לי אילו לאמץ באתר.
          </p>
        </div>
      </div>

      <Effect1 />
      <Effect2 />
      <Effect3 />
      <Effect4 />
      <Effect5 />
      <Effect6 />

      <div className="grid place-items-center bg-[#15100c] px-6 py-32 text-center text-white">
        <div className="max-w-xl">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black">אז… איזה בא לך?</h2>
          <p className="mt-4 text-[18px] text-white/60">
            תגיד לי מספרים (אפשר כמה) ואני אאמץ אותם ל-&quot;/&quot;.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[16px] font-bold text-white"
            style={{ background: ACCENT }}
          >
            <ArrowRight size={18} /> חזרה לאתר
          </Link>
        </div>
      </div>
    </main>
  )
}
