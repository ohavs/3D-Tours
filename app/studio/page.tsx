'use client'

// ============================================================
// app/studio/page.tsx — דף בית חדש מאפס, נבנה ישירות לפי המלצת
// ui-ux-pro-max:
//   Pattern : Immersive / Interactive Experience
//   Style   : Exaggerated Minimalism (טיפוגרפיה ענקית, ניגודיות,
//             whitespace מסיבי, אקסנט בודד)
//   Colors  : Trust teal #0F766E + professional blue #0369A1
//   Effects : clamp type, font-weight 900, massive whitespace
// פונט: עברית ב-Discovery FS (הפונטים של הסקיל לא תומכים עברית),
//       Cinzel ל-wordmark/מספרים לטיניים.
// עצמאי לחלוטין — לא נוגע ב-theme הגלובלי ולא ברכיבי האתר הקיים.
// ============================================================

import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { ArrowUpLeft, Plus } from 'lucide-react'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['500', '600', '700'] })

const BASE = 'https://photo-sphere-viewer-data.netlify.app/assets/tour/'

// פלטת הסקיל
const C = {
  bg: '#F0FDFA',
  ink: '#0B3D39',
  primary: '#0F766E',
  secondary: '#14B8A6',
  accent: '#0369A1',
  muted: '#5B807C',
  line: '#CDE9E4',
  card: '#FFFFFF',
}

// --- חשיפה בכניסה (תנועה מאוזנת) ---
function Fade({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const STEPS = [
  { n: 'I', t: 'תיאום', d: 'קובעים מועד. מגיע עם כל הציוד.' },
  { n: 'II', t: 'צילום', d: 'סריקת 360° מלאה — שעה־שעתיים בנכס.' },
  { n: 'III', t: 'בנייה', d: 'מחבר את החדרים לסיור אינטראקטיבי.' },
  { n: 'IV', t: 'מסירה', d: 'לינק וקוד הטמעה תוך 48 שעות.' },
]
const GALLERY = [2, 3, 4, 5, 6, 7].map((i) => `${BASE}key-biscayne-${i}.jpg`)
const QUOTES = [
  { q: 'הנכס נמכר תוך שבועיים. הסיור הוא מה שהביא את הקונים.', n: 'דנה לוי', r: 'מתווכת' },
  { q: 'הלידים שהגיעו היו הרבה יותר רציניים — כבר ראו את הבית.', n: 'אבי כהן', r: 'משכיר' },
  { q: 'איכות מטורפת ושירות מהיר. הטמעתי באתר תוך דקה.', n: 'מיכל ברק', r: 'יזמית' },
]

export default function StudioPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <main dir="rtl" style={{ background: C.bg, color: C.ink }} className="min-h-screen">
      {/* ===== nav משלו ===== */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-6 sm:px-10">
          <Link href="/studio" className={`${cinzel.className} text-[22px] font-bold tracking-[0.25em] text-white`}>
            TOUR360
          </Link>
          <Link
            href="/tour/test"
            className="rounded-full border border-white/40 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            סיור לדוגמה
          </Link>
        </div>
      </header>

      {/* ===== HERO — full-screen immersive ===== */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[640px] items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE}key-biscayne-1.jpg`} alt="" className="h-[125%] w-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(11,61,57,0.55) 0%, rgba(11,61,57,0.35) 40%, rgba(11,61,57,0.92) 100%)` }} />
        </motion.div>

        <motion.div style={{ opacity: heroFade }} className="relative mx-auto w-full max-w-[1300px] px-6 sm:px-10">
          <Fade>
            <span className="mb-8 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.35em] text-white/75">
              <span className="h-px w-10" style={{ background: C.secondary }} />
              360° real estate
            </span>
          </Fade>
          <Fade delay={0.1}>
            <h1
              className="font-black text-white"
              style={{ fontSize: 'clamp(3.2rem, 12vw, 11rem)', lineHeight: 0.92, letterSpacing: '-0.04em' }}
            >
              להיכנס,
              <br />
              לא להציץ.
            </h1>
          </Fade>
          <Fade delay={0.2}>
            <p className="mt-8 max-w-md text-[19px] leading-relaxed text-white/80">
              סיור וירטואלי שגורם לקונה להרגיש בתוך הנכס — הרבה לפני
              שהרים טלפון.
            </p>
          </Fade>
          <Fade delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/tour/test"
                className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-[16px] font-bold text-white transition-transform hover:scale-[1.03]"
                style={{ background: C.accent }}
              >
                כניסה לסיור חי
                <ArrowUpLeft size={20} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <a href="#contact" className="text-[16px] font-semibold text-white underline-offset-8 hover:underline">
                לקבלת הצעת מחיר
              </a>
            </div>
          </Fade>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/50">
          גלול
        </div>
      </section>

      {/* ===== הצהרה ענקית — exaggerated minimalism ===== */}
      <section className="mx-auto max-w-[1300px] px-6 py-32 sm:px-10 sm:py-44">
        <Fade>
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: C.primary }}>
            01 — החוויה
          </p>
        </Fade>
        <Fade delay={0.1}>
          <h2 className="mt-8 font-black" style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.03em', color: C.ink }}>
            לא תמונות.
            <span style={{ color: C.muted }}> חלל שלם</span>
            <br />
            שאפשר לצעוד בתוכו.
          </h2>
        </Fade>
      </section>

      {/* ===== מספרים ענקיים ===== */}
      <section className="border-y" style={{ borderColor: C.line, background: C.card }}>
        <div className="mx-auto grid max-w-[1300px] gap-16 px-6 py-24 sm:grid-cols-3 sm:px-10">
          {[
            { v: '2.7×', l: 'יותר זמן צפייה' },
            { v: '48', s: 'שעות', l: 'מצילום לסיור מוכן' },
            { v: '24/7', l: 'פתוח לביקור' },
          ].map((m, i) => (
            <Fade key={i} delay={i * 0.1}>
              <div>
                <p className={`${cinzel.className} font-bold`} style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', lineHeight: 1, color: C.primary }}>
                  {m.v}
                  {m.s && <span className="mr-2 text-[0.3em] align-middle" style={{ color: C.muted }}>{m.s}</span>}
                </p>
                <p className="mt-4 text-[17px]" style={{ color: C.muted }}>{m.l}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ===== תהליך ===== */}
      <section className="mx-auto max-w-[1300px] px-6 py-32 sm:px-10">
        <Fade>
          <h2 className="font-black" style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.03em', color: C.ink }}>
            איך זה עובד
          </h2>
        </Fade>
        <div className="mt-20 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Fade key={s.n} delay={i * 0.08}>
              <div className="border-t pt-6" style={{ borderColor: C.ink }}>
                <span className={`${cinzel.className} text-[15px] font-bold tracking-[0.2em]`} style={{ color: C.secondary }}>
                  {s.n}
                </span>
                <h3 className="mt-6 text-[26px] font-bold" style={{ color: C.ink }}>{s.t}</h3>
                <p className="mt-3 text-[16px] leading-relaxed" style={{ color: C.muted }}>{s.d}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ===== גלריה ===== */}
      <section className="px-6 pb-32 sm:px-10">
        <div className="mx-auto max-w-[1300px]">
          <Fade>
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-black" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.03em', color: C.ink }}>
                סיורים נבחרים
              </h2>
              <Link href="/tour/test" className="text-[15px] font-semibold" style={{ color: C.accent }}>
                לכל הסיורים →
              </Link>
            </div>
          </Fade>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((src, i) => (
              <Fade key={src} delay={(i % 3) * 0.08}>
                <Link href="/tour/test" className="group relative block aspect-[4/5] overflow-hidden rounded-[4px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(0deg, ${C.primary}cc, transparent 60%)` }} />
                  <span className="absolute bottom-5 right-5 flex items-center gap-2 text-[14px] font-semibold text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <Plus size={16} /> כניסה
                  </span>
                </Link>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ===== המלצות ===== */}
      <section className="border-y" style={{ borderColor: C.line, background: C.card }}>
        <div className="mx-auto max-w-[1300px] px-6 py-32 sm:px-10">
          <div className="grid gap-12 md:grid-cols-3">
            {QUOTES.map((t, i) => (
              <Fade key={i} delay={i * 0.1}>
                <figure>
                  <p className={`${cinzel.className} text-[44px] leading-none`} style={{ color: C.secondary }}>“</p>
                  <blockquote className="mt-2 text-[21px] leading-relaxed" style={{ color: C.ink }}>{t.q}</blockquote>
                  <figcaption className="mt-6 text-[15px]">
                    <span className="font-bold" style={{ color: C.ink }}>{t.n}</span>
                    <span style={{ color: C.muted }}> · {t.r}</span>
                  </figcaption>
                </figure>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA אחרי ===== */}
      <section id="contact" className="px-6 py-32 sm:px-10">
        <Fade>
          <div className="mx-auto max-w-[1300px] rounded-[8px] px-8 py-24 text-center sm:px-10" style={{ background: C.primary }}>
            <h2 className="mx-auto max-w-3xl font-black text-white" style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.03em' }}>
              יש לכם נכס?
              <br />
              בואו נדבר.
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <a href="https://wa.me/972500000000" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-8 py-4 text-[16px] font-bold" style={{ color: C.primary }}>
                וואטסאפ
              </a>
              <a href="mailto:ohav88@gmail.com" className="rounded-full border border-white/50 px-8 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-white/10">
                אימייל
              </a>
            </div>
          </div>
        </Fade>
      </section>

      {/* ===== footer ===== */}
      <footer className="border-t" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-between gap-4 px-6 py-12 sm:px-10">
          <span className={`${cinzel.className} text-[20px] font-bold tracking-[0.25em]`} style={{ color: C.ink }}>TOUR360</span>
          <p className="text-[13px]" style={{ color: C.muted }}>© {new Date().getFullYear()} — שירות צילום וסיורים 360° לנדל&quot;ן</p>
        </div>
      </footer>
    </main>
  )
}
