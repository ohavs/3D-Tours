// ============================================================
// app/page.tsx — דף הבית (Ventriloc: קונסולת אנליטיקס על נייר)
// hero מפוצל (טקסט + מוקאפ דשבורד), אלמנט סיור אחד, שלושה צעדים,
// קריאה לפעולה, ופוטר. טיפוגרפיה גדולה ואחידה, אקסנט כתום עדין.
// ============================================================

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/anim'
import HeroShowcase from '@/components/HeroShowcase'

const STEPS = [
  { n: '01', t: 'מצלמים', d: 'תמונת 360° לכל חדר עם מצלמת פנורמה.' },
  { n: '02', t: 'מחברים', d: 'מסמנים חצי ניווט בין החדרים בעורך.' },
  { n: '03', t: 'משתפים', d: 'לינק ייחודי וקוד הטמעה מוכן לכל אתר.' },
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

          {/* מוקאפ דשבורד */}
          <HeroShowcase />
        </div>
      </section>

      {/* ===================== אלמנט הסיור היחיד ===================== */}
      <section id="features" className="mx-auto max-w-[1200px] px-6 py-20">
        <Reveal>
          <div className="overflow-hidden rounded-lg border border-slate/15 bg-paper shadow-soft">
            <div className="grid items-stretch gap-0 md:grid-cols-2">
              {/* טקסט */}
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <h2 className="font-display text-heading-sm font-extrabold text-carbon sm:text-heading">
                  לא תמונה.
                  <br />
                  צעידה אמיתית בנכס.
                </h2>
                <p className="mt-5 max-w-md text-body-lg text-graphite">
                  הלקוח עובר מנקודה לנקודה, מסתובב 360° בכל חדר, ומרגיש את החלל
                  והאור — בדיוק כמו ביקור פיזי.
                </p>
                <div className="mt-8">
                  <Link
                    href="/tour/test"
                    className="inline-flex items-center gap-2 rounded-full bg-carbon px-6 py-3 text-body font-semibold text-paper transition-opacity hover:opacity-85"
                  >
                    התחילו סיור
                    <ArrowLeft size={18} strokeWidth={2.4} />
                  </Link>
                </div>
              </div>
              {/* תצוגה מקדימה (אלמנט סיור יחיד) */}
              <Link
                href="/tour/test"
                className="group relative block min-h-[320px] bg-mist md:min-h-[460px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-3.jpg"
                  alt="תצוגת סיור 360°"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-caption font-semibold text-carbon shadow-card">
                  <span className="h-2 w-2 rounded-full bg-signal" />
                  סיור חי 360°
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================== שלושה צעדים ===================== */}
      <section id="how" className="mx-auto max-w-[1200px] px-6 py-20">
        <Reveal>
          <h2 className="font-display text-heading-sm font-extrabold text-carbon sm:text-heading">
            שלושה צעדים. זה הכל.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <span className="font-display text-heading font-extrabold text-signal">
                {s.n}
              </span>
              <h3 className="mt-3 text-subheading font-bold text-carbon">
                {s.t}
              </h3>
              <p className="mt-2 text-body-lg text-graphite">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section id="tours" className="mx-auto max-w-[1200px] px-6 py-24">
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
              <a href="#features" className="hover:text-carbon">יכולות</a>
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
