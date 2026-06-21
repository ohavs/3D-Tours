// ============================================================
// app/page.tsx — אתר שירות (לא SaaS):
// מציג את השירות — צילום/סריקת נכס ובניית סיור וירטואלי 360°
// שמוטמע באתר הלקוח. בלי כרטיסי-אייקונים גנריים; הצגה עריכותית.
// ============================================================

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Reveal, CountUp } from '@/components/anim'

const CONTACT_EMAIL = 'ohav88@gmail.com'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ======================= HERO ======================= */}
      <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-16 sm:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-caption font-medium text-graphite">
                <span className="h-2 w-2 rounded-full bg-signal" />
                שירות צילום וסיורים 360° לנדל&quot;ן
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 font-display text-heading-lg font-extrabold text-carbon sm:text-display">
                סורקים את הנכס.
                <br />
                בונים את הסיור.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-body-lg text-graphite">
                אני מגיע אליך, מצלם את הנכס ב-360°, ומקים סיור וירטואלי
                אינטראקטיבי — עם לינק וקוד הטמעה מוכן לאתר שלך.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/tour/test"
                  className="inline-flex items-center gap-2 rounded-full bg-carbon px-6 py-3 text-body font-semibold text-paper transition-opacity hover:opacity-85"
                >
                  ראו דוגמה חיה
                  <ArrowLeft size={18} strokeWidth={2.4} />
                </Link>
                <a
                  href="#contact"
                  className="rounded-full border border-carbon px-6 py-3 text-body font-semibold text-carbon transition-colors hover:bg-chalk"
                >
                  דברו איתי
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
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-caption font-semibold text-carbon shadow-soft">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
                  סיור חי 360°
                </span>
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

      {/* ===================== הערך (עריכותי) ===================== */}
      <section id="service" className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <Reveal>
            <h2 className="font-display text-heading-sm font-extrabold text-carbon sm:text-heading">
              לא תמונות.
              <br />
              חוויית מקום.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-lg text-graphite">
              סיור 360° נותן ללקוח לצעוד בתוך הנכס, להסתובב בכל חדר ולהרגיש את
              החלל והאור — בדיוק כמו ביקור פיזי. וזה עובד.
            </p>
          </Reveal>
        </div>

        {/* מספרים גדולים — לא כרטיסים, טיפוגרפיה בלבד */}
        <div className="mt-16 grid gap-y-10 border-t border-slate/20 pt-12 sm:grid-cols-3 sm:divide-x sm:divide-slate/20 sm:rtl:divide-x-reverse">
          <Reveal>
            <div className="sm:px-8 sm:first:pr-0">
              <p className="font-display text-heading font-extrabold text-carbon">
                <CountUp to={2.7} decimals={1} suffix="×" />
              </p>
              <p className="mt-2 text-body text-graphite">יותר זמן צפייה מול תמונות רגילות</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="sm:px-8">
              <p className="font-display text-heading font-extrabold text-carbon">
                24<span className="text-signal">/</span>7
              </p>
              <p className="mt-2 text-body text-graphite">הנכס פתוח לביקור, מכל מכשיר</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="sm:px-8">
              <p className="font-display text-heading font-extrabold text-carbon">
                <CountUp to={48} suffix=" שעות" />
              </p>
              <p className="mt-2 text-body text-graphite">מהצילום ועד סיור מוכן לשיתוף</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== מה מקבלים + קוד הטמעה ===================== */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="font-display text-heading-sm font-extrabold text-carbon sm:text-heading">
                לינק אחד.
                <br />
                ומוטמע אצלך באתר.
              </h2>
              <p className="mt-5 max-w-md text-body-lg text-graphite">
                בסיום העבודה מקבלים כתובת ייחודית לסיור, וקוד הטמעה (iframe)
                שמשבצים ישירות במודעה או באתר — הסיור פשוט מופיע שם, חי.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-lg border border-slate/15 bg-paper p-6 shadow-soft">
              <span className="text-caption font-medium text-graphite">קוד הטמעה</span>
              <pre
                dir="ltr"
                className="mt-3 overflow-x-auto rounded-md bg-fog p-4 text-[13px] leading-relaxed text-carbon"
              >
                <code>{`<iframe
  src="https://tour360.co.il/tour/abc123"
  width="100%" height="520"
  style="border:0;border-radius:12px"
  allowfullscreen
></iframe>`}</code>
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== צור קשר ===================== */}
      <section id="contact" className="mx-auto max-w-[1200px] px-6 pb-24">
        <Reveal>
          <div className="rounded-lg bg-carbon px-8 py-16 text-center sm:py-20">
            <h2 className="mx-auto max-w-2xl font-display text-heading-sm font-extrabold text-paper sm:text-heading">
              יש לכם נכס? בואו נדבר.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-body-lg text-paper/70">
              מתאמים צילום, ואני דואג לכל השאר — עד סיור מוכן לשיתוף.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-body font-semibold text-carbon transition-opacity hover:opacity-85"
              >
                שלחו אימייל
                <ArrowLeft size={18} strokeWidth={2.4} />
              </a>
              <Link
                href="/tour/test"
                className="rounded-full border border-paper/30 px-7 py-3.5 text-body font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                ראו דוגמה
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
              שירות צילום וסיורים וירטואליים 360° לנדל&quot;ן.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex gap-6 text-caption font-medium text-graphite">
              <a href="#service" className="hover:text-carbon">השירות</a>
              <a href="#contact" className="hover:text-carbon">צור קשר</a>
              <Link href="/tour/test" className="hover:text-carbon">דוגמה</Link>
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
