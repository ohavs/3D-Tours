// ============================================================
// app/page.tsx — דף הבית (בהשראת Eden)
// נקי, ניטרלי, אלמנטים גדולים ומעוגלים, הרבה אוויר.
// אנימציות: כניסת hero בטעינה, וחשיפה בכניסה לכל סקשן בגלילה.
// ============================================================

import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  Users,
  Smartphone,
  Code2,
  Compass,
  BarChart3,
  Share2,
} from 'lucide-react'
import { Reveal, Magnetic, CountUp } from '@/components/anim'

const TRUST = [
  { icon: Users, label: 'מאות סיורים פעילים' },
  { icon: Smartphone, label: 'צפייה מכל מכשיר' },
  { icon: Code2, label: 'לינק + קוד הטמעה' },
]

const ROWS = [
  { icon: Compass, title: 'ניווט בין חדרים', hint: 'חצים על הרצפה' },
  { icon: BarChart3, title: 'אנליטיקס צפיות', hint: 'מי צפה וכמה זמן' },
  { icon: Share2, title: 'קוד הטמעה לאתר', hint: 'iframe מוכן' },
]

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ======================= HERO ======================= */}
      <section className="mx-auto max-w-[1180px] px-6 pb-10 pt-14 sm:pt-20">
        {/* כותרת + פסי אמון */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <h1 className="font-display text-heading font-extrabold text-ink sm:text-heading-lg">
              סיור 360°
              <br />
              מותאם לכל נכס
            </h1>
            <p className="mt-5 max-w-md text-body-lg text-ash">
              תנו ללקוחות לצעוד בתוך הנכס — מכל מקום, בכל שעה.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="space-y-2.5">
              {TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-2.5 text-ash">
                  <t.icon size={18} className="text-graphite" />
                  <span className="text-caption">{t.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* שני כרטיסים גדולים */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal delay={0.1}>
            <BigCard
              image="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-3.jpg"
              title="סיור 360° אינטראקטיבי"
              sub="צעדו בין החדרים, הסתובבו בכל זווית"
              cta="התחילו סיור"
              href="/tour/test"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <BigCard
              image="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-5.jpg"
              title="שיתוף בלחיצה אחת"
              sub="לינק ייחודי וקוד הטמעה לכל אתר"
              cta="איך זה עובד"
              href="#how"
              tone="dark"
            />
          </Reveal>
        </div>

        {/* שורת קישורים דקה (סגנון Eden) */}
        <Reveal delay={0.15}>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {ROWS.map((r) => (
              <Link
                key={r.title}
                href="#features"
                className="group flex items-center justify-between rounded-2xl border border-dove bg-pure-white px-5 py-4 transition-colors hover:bg-mist"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist text-ink transition-colors group-hover:bg-pure-white">
                    <r.icon size={20} strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-caption font-semibold text-ink">
                      {r.title}
                    </span>
                    <span className="block text-[13px] text-graphite">
                      {r.hint}
                    </span>
                  </span>
                </span>
                <ChevronLeft
                  size={18}
                  className="text-graphite transition-transform group-hover:-translate-x-1"
                />
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===================== SHOWCASE ===================== */}
      <section id="features" className="mx-auto max-w-[1180px] px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="font-display text-heading-sm font-extrabold text-ink sm:text-heading">
                לא תמונה.
                <br />
                צעידה אמיתית בנכס.
              </h2>
              <p className="mt-5 max-w-md text-body-lg text-ash">
                הלקוח עובר מנקודה לנקודה, מסתובב 360° בכל חדר, ומרגיש את החלל
                והאור — בדיוק כמו ביקור פיזי.
              </p>
              <div className="mt-8">
                <Magnetic className="inline-block">
                  <Link
                    href="/tour/test"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-body font-semibold text-pure-white transition-opacity hover:opacity-85"
                  >
                    נסו עכשיו
                    <ArrowLeft size={18} strokeWidth={2.4} />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="group relative overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-1.jpg"
                alt="תצוגת סיור 360°"
                className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section id="how" className="mx-auto max-w-[1180px] px-6 py-10">
        <div className="rounded-3xl bg-mist p-10 sm:p-16">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            {[
              { v: <CountUp to={2.7} decimals={1} suffix="×" />, l: 'יותר זמן צפייה' },
              { v: <CountUp to={24} suffix="/7" />, l: 'פתוח לביקור' },
              { v: <CountUp to={5} suffix=" דק׳" />, l: 'מהעלאה ללינק' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <p className="font-display text-heading font-extrabold text-ink sm:text-heading-lg">
                  {s.v}
                </p>
                <p className="mt-2 text-body text-ash">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section id="tours" className="mx-auto max-w-[1180px] px-6 py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-display text-heading-sm font-extrabold text-ink sm:text-heading">
            מוכנים לתת ללקוחות לצעוד פנימה?
          </h2>
          <div className="mt-9">
            <Magnetic className="inline-block">
              <Link
                href="/tour/test"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-body font-semibold text-pure-white transition-opacity hover:opacity-85"
              >
                כניסה לסיור לדוגמה
                <ArrowLeft size={18} strokeWidth={2.4} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-dove">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <span className="text-[20px] font-extrabold text-ink">
            tour<span className="text-graphite">360</span>
          </span>
          <p className="text-caption text-graphite">
            © {new Date().getFullYear()} כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </main>
  )
}

// ---------- כרטיס גדול עם תמונה וטקסט עליו ----------
function BigCard({
  image,
  title,
  sub,
  cta,
  href,
  tone = 'light',
}: {
  image: string
  title: string
  sub: string
  cta: string
  href: string
  tone?: 'light' | 'dark'
}) {
  return (
    <Link
      href={href}
      className="group relative block h-[360px] overflow-hidden rounded-3xl sm:h-[440px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className={`absolute inset-0 ${
          tone === 'dark'
            ? 'bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10'
            : 'bg-gradient-to-t from-ink/70 via-ink/15 to-transparent'
        }`}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-7">
        <div>
          <h3 className="text-subheading font-bold text-pure-white sm:text-heading-sm">
            {title}
          </h3>
          <p className="mt-2 max-w-xs text-body text-pure-white/85">{sub}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-pure-white px-5 py-2.5 text-caption font-semibold text-ink transition-transform group-hover:-translate-y-0.5">
          {cta}
          <ArrowLeft size={16} strokeWidth={2.4} />
        </span>
      </div>
    </Link>
  )
}
