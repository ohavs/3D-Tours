// ============================================================
// app/page.tsx — דף הבית (Ventriloc)
// hero מפוצל: טקסט + תצוגת סיור אחת (אלמנט הסיור היחיד).
// אחריו: שלושה צעדים, קריאה לפעולה, ופוטר.
// ============================================================

import Link from 'next/link'
import { ArrowLeft, Compass, MousePointerClick, Share2 } from 'lucide-react'
import { Reveal } from '@/components/anim'

const STEPS = [
  { icon: Compass, n: '01', t: 'מצלמים', d: 'תמונת 360° לכל חדר עם מצלמת פנורמה.' },
  { icon: MousePointerClick, n: '02', t: 'מחברים', d: 'מסמנים חצי ניווט בין החדרים בעורך.' },
  { icon: Share2, n: '03', t: 'משתפים', d: 'לינק ייחודי וקוד הטמעה מוכן לכל אתר.' },
]

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ======================= HERO ======================= */}
      <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-16 sm:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          {/* טקסט */}
          <div>
            <Reveal>
              <h1 className="font-display text-heading-lg font-extrabold text-carbon sm:text-display">
                סיור וירטואלי
                <br />
                לכל נכס
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-body-lg text-graphite">
                תנו ללקוחות לצעוד בתוך הנכס — מכל מקום, בכל שעה, מכל מכשיר.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/tour/test"
                  className="inline-flex items-center gap-2 rounded-full bg-carbon px-6 py-3 text-body font-semibold text-paper transition-opacity hover:opacity-85"
                >
                  סיור לדוגמה
                  <ArrowLeft size={18} strokeWidth={2.4} />
                </Link>
                <a
                  href="#how"
                  className="rounded-full border border-carbon px-6 py-3 text-body font-semibold text-carbon transition-colors hover:bg-chalk"
                >
                  איך זה עובד
                </a>
              </div>
            </Reveal>
          </div>

          {/* תצוגת הסיור (אלמנט יחיד) */}
          <Reveal delay={0.15}>
            <Link
              href="/tour/test"
              className="group block overflow-hidden rounded-lg border border-slate/15 bg-paper p-2.5 shadow-card"
            >
              <div className="relative overflow-hidden rounded-md bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-3.jpg"
                  alt="תצוגת סיור 360°"
                  className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[440px]"
                />
                {/* תווית סיור חי */}
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-caption font-semibold text-carbon shadow-soft">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
                  סיור חי 360°
                </span>
                {/* כפתור הפעלה במרכז */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 shadow-card transition-transform group-hover:scale-110">
                    <ArrowLeft className="text-carbon" size={26} strokeWidth={2.4} />
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================== שלושה צעדים ===================== */}
      <section id="how" className="mx-auto max-w-[1200px] px-6 py-24">
        <Reveal>
          <h2 className="font-display text-heading-sm font-extrabold text-carbon sm:text-heading">
            שלושה צעדים. זה הכל.
          </h2>
          <p className="mt-4 max-w-md text-body-lg text-graphite">
            מצילום הנכס ועד לינק מוכן לשיתוף — בלי ידע טכני.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-signal shadow-soft">
                  <s.icon size={22} strokeWidth={2} />
                </span>
                <span className="font-display text-heading-sm font-extrabold text-carbon">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-5 text-subheading font-bold text-carbon">
                {s.t}
              </h3>
              <p className="mt-2 text-body-lg text-graphite">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section id="tours" className="mx-auto max-w-[1200px] px-6 pb-24">
        <Reveal>
          <div className="rounded-lg bg-carbon px-8 py-16 text-center sm:py-20">
            <h2 className="mx-auto max-w-2xl font-display text-heading-sm font-extrabold text-paper sm:text-heading">
              מוכנים לתת ללקוחות לצעוד פנימה?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-body-lg text-paper/70">
              התחילו מהסיור לדוגמה וראו איך זה מרגיש.
            </p>
            <div className="mt-9">
              <Link
                href="/tour/test"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-body font-semibold text-carbon transition-opacity hover:opacity-85"
              >
                כניסה לסיור לדוגמה
                <ArrowLeft size={18} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-slate/20">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-14 sm:grid-cols-2">
          <div>
            <span className="text-[22px] font-extrabold tracking-tight text-carbon">
              tour<span className="text-signal">.</span>360
            </span>
            <p className="mt-3 max-w-xs text-caption text-graphite">
              פלטפורמת סיורים וירטואליים 360° לנדל&quot;ן.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex gap-6 text-caption font-medium text-graphite">
              <a href="#how" className="hover:text-carbon">איך זה עובד</a>
              <Link href="/tour/test" className="hover:text-carbon">סיור לדוגמה</Link>
            </div>
            <p className="text-caption text-slate">
              © {new Date().getFullYear()} tour.360 — כל הזכויות שמורות
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
