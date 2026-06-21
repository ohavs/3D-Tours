// ============================================================
// app/page.tsx — דף הבית
// שפה נקייה ומודרנית, אקסנט ירוק, כרטיסים מעוגלים ואייקוני קו.
// אנימציות מתקדמות: חשיפה בגלילה, parallax, hover-tilt, מספרים
// מטפסים, וכפתורים מגנטיים.
// ============================================================

import Link from 'next/link'
import {
  ArrowLeft,
  Compass,
  Share2,
  BarChart3,
  Camera,
  MousePointerClick,
  Sparkles,
} from 'lucide-react'
import { Reveal, Tilt, Magnetic, CountUp } from '@/components/anim'
import HeroShowcase from '@/components/HeroShowcase'

const FEATURES = [
  {
    icon: Compass,
    title: 'ניווט בין חדרים',
    desc: 'חצים על הרצפה שמובילים מחדר לחדר — תחושת צעידה אמיתית בנכס.',
  },
  {
    icon: Share2,
    title: 'לינק וקוד הטמעה',
    desc: 'כל סיור מקבל כתובת ייחודית וקוד iframe מוכן לאתר הלקוח.',
  },
  {
    icon: BarChart3,
    title: 'אנליטיקס',
    desc: 'מי צפה, כמה זמן, ובאילו חדרים — נתונים שעוזרים לסגור עסקה.',
  },
]

const STEPS = [
  { icon: Camera, n: '01', t: 'מצלמים', d: 'תמונת 360° לכל חדר.' },
  { icon: MousePointerClick, n: '02', t: 'מחברים', d: 'מסמנים חצי ניווט בין החדרים.' },
  { icon: Share2, n: '03', t: 'משתפים', d: 'שולחים לינק או מטמיעים באתר.' },
]

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ======================= HERO ======================= */}
      <section className="relative overflow-hidden">
        {/* זוהר ירוק עדין ברקע */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              'radial-gradient(50% 60% at 50% 0%, rgba(25,200,83,0.14) 0%, rgba(25,200,83,0) 70%)',
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-16 text-center sm:pt-24">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dove bg-pure-white px-3.5 py-1.5 text-caption font-medium text-ash">
              <Sparkles size={15} className="text-green" />
              סיורי 360° לנדל&quot;ן
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-7 max-w-3xl font-display text-heading font-extrabold text-ink sm:text-heading-lg">
              הנכס שלך, פתוח לביקור{' '}
              <span className="text-green">מכל מקום</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-ash">
              פלטפורמת סיורים וירטואליים שמכניסה את הלקוחות פנימה — לצעוד בחדרים
              ולהרגיש את החלל עוד לפני שדרכו כף רגל בדלת.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex items-center justify-center gap-4">
              <Magnetic>
                <Link
                  href="/tour/test"
                  className="flex items-center gap-2 rounded-full bg-green px-7 py-3.5 text-body font-semibold text-pure-white shadow-green transition-colors hover:bg-green-strong"
                >
                  התחילו סיור לדוגמה
                  <ArrowLeft size={18} strokeWidth={2.4} />
                </Link>
              </Magnetic>
              <Link
                href="#how"
                className="rounded-full border border-dove bg-pure-white px-7 py-3.5 text-body font-semibold text-ink transition-colors hover:bg-mist"
              >
                איך זה עובד
              </Link>
            </div>
          </Reveal>

          {/* מוקאפ המוצר */}
          <div className="mt-16">
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="features" className="mx-auto max-w-[1200px] px-6 py-24">
        <Reveal>
          <h2 className="max-w-2xl font-display text-heading-sm font-extrabold text-ink sm:text-heading">
            כל מה שצריך כדי שנכס ימכור את עצמו
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <Tilt className="h-full">
                <div className="group h-full rounded-3xl border border-dove/70 bg-pure-white p-7 shadow-soft transition-shadow hover:shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-soft text-green transition-transform group-hover:scale-110">
                    <f.icon size={24} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 text-subheading font-bold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-body text-ash">{f.desc}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how" className="bg-pure-white">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <Reveal>
            <h2 className="font-display text-heading-sm font-extrabold text-ink sm:text-heading">
              שלושה צעדים. זה הכל.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="relative h-full rounded-3xl border border-dove/70 bg-canvas p-7">
                  <span className="absolute left-7 top-7 text-caption font-bold text-graphite">
                    {s.n}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-pure-white">
                    <s.icon size={22} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 text-subheading font-bold text-ink">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-body text-ash">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS BAND ===================== */}
      <section className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="overflow-hidden rounded-3xl bg-ink p-10 sm:p-14">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            {[
              { v: <CountUp to={2.7} decimals={1} suffix="×" />, l: 'יותר זמן צפייה מתמונות רגילות' },
              { v: <CountUp to={24} suffix="/7" />, l: 'הנכס פתוח לביקור, תמיד' },
              { v: <CountUp to={5} suffix=" דק׳" />, l: 'מהעלאה ללינק מוכן' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <p className="font-display text-heading font-extrabold text-green sm:text-heading-lg">
                  {s.v}
                </p>
                <p className="mt-2 text-body text-pure-white/70">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-heading-sm font-extrabold text-ink sm:text-heading">
            מוכנים לתת ללקוחות לצעוד פנימה?
          </h2>
          <div className="mt-9">
            <Magnetic className="inline-block">
              <Link
                href="/tour/test"
                className="inline-flex items-center gap-2 rounded-full bg-green px-8 py-4 text-body font-semibold text-pure-white shadow-green transition-colors hover:bg-green-strong"
              >
                כניסה לסיור לדוגמה
                <ArrowLeft size={18} strokeWidth={2.4} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-dove/60 bg-pure-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2 text-ash">
            <Compass size={18} className="text-green" />
            <span className="text-caption font-semibold text-ink">סיורים 360°</span>
          </div>
          <p className="text-caption text-graphite">
            © {new Date().getFullYear()} כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </main>
  )
}
