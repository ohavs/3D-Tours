// ============================================================
// app/page.tsx — דף הבית
// בהשראת giraffe360: הרבה אוויר, כותרות ענק, אלמנטים גדולים
// ומעוגלים, ויזואלים גדולים — בצבעים של מערכת העיצוב (Steep).
// תנועה: כניסות בגלילה (Reveal), ריחוף (Float), הרמה ב-hover.
// ============================================================

import Link from 'next/link'
import { Reveal, Float } from '@/components/anim'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ======================= HERO ======================= */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 45% at 50% 18%, #fbe1d1 0%, rgba(251,225,209,0) 72%)',
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-24 pt-24 text-center sm:pt-32">
          <Reveal>
            <span className="inline-block rounded-full border border-dove/60 bg-pure-white px-4 py-1.5 text-caption font-medium text-ash">
              סיורי 360° לנדל&quot;ן
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-8 max-w-4xl font-display text-heading font-bold leading-[1.05] text-ink sm:text-heading-lg">
              כל נכס. בכל מקום.
              <br />
              <span className="text-rust">בתוך הסיור.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-2xl text-body-lg text-ash sm:text-subheading">
              פלטפורמת סיורים וירטואליים 360° שמכניסה את הלקוחות פנימה — לצעוד
              בחדרים, להרגיש את החלל, ולהתאהב עוד לפני הביקור.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex items-center justify-center gap-5">
              <Link
                href="/tour/test"
                className="rounded-full bg-ink px-8 py-4 text-body font-medium text-pure-white transition hover:opacity-90 active:scale-95"
              >
                התחילו סיור לדוגמה
              </Link>
              <Link
                href="#features"
                className="text-body font-medium text-ink transition hover:opacity-70"
              >
                גלו עוד ←
              </Link>
            </div>
          </Reveal>

          {/* ויזואל ענק — תצוגת המוצר */}
          <Reveal delay={0.2} y={48}>
            <Float className="mx-auto mt-20 max-w-5xl">
              <div className="rounded-3xl bg-pure-white p-3 shadow-card sm:p-4">
                <div className="grid gap-3 sm:grid-cols-[240px_1fr]">
                  <div className="rounded-2xl bg-fog p-5">
                    <p className="text-caption text-graphite">נקודות בסיור</p>
                    <ul className="mt-4 space-y-2 text-body text-ink">
                      {['כניסה', 'סלון', 'מטבח', 'חדר שינה', 'מרפסת'].map(
                        (r, i) => (
                          <li
                            key={r}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                              i === 1 ? 'bg-pure-white shadow-card' : ''
                            }`}
                          >
                            <span>{r}</span>
                            <span className="text-graphite">›</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-3.jpg"
                      alt="תצוגת סיור 360°"
                      className="h-72 w-full object-cover sm:h-[26rem]"
                    />
                    <span className="absolute bottom-8 right-1/2 flex translate-x-1/2 items-center gap-2 rounded-full bg-pure-white px-5 py-2.5 text-body font-semibold text-ink shadow-card">
                      <span className="h-2.5 w-2.5 rounded-full bg-rust" />
                      גררו לסיבוב · לחצו לצעוד
                    </span>
                  </div>
                </div>
              </div>
            </Float>
          </Reveal>
        </div>
      </section>

      {/* ===================== TRUST STRIP ===================== */}
      <section className="border-y border-dove/30 bg-fog">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 py-7 text-caption font-medium text-graphite">
          <span>סוכני נדל&quot;ן</span>
          <span>·</span>
          <span>משרדי תיווך</span>
          <span>·</span>
          <span>בעלי נכסים</span>
          <span>·</span>
          <span>חברות יזמות</span>
        </div>
      </section>

      {/* ===================== FEATURE 1 ===================== */}
      <section id="features" className="bg-pure-white">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <Reveal>
              <div>
                <p className="text-caption font-semibold text-rust">
                  חוויית הצפייה
                </p>
                <h2 className="mt-4 font-display text-heading-sm font-bold leading-[1.1] text-ink sm:text-heading">
                  לא תמונה. צעידה אמיתית בתוך הנכס.
                </h2>
                <p className="mt-5 text-body-lg text-ash">
                  הלקוח עובר מנקודה לנקודה עם חצים על הרצפה, מסתובב 360° בכל
                  חדר, ומרגיש את הפרופורציות והאור — בדיוק כמו ביקור פיזי.
                </p>
                <Link
                  href="/tour/test"
                  className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-body font-medium text-pure-white transition hover:opacity-90 active:scale-95"
                >
                  נסו עכשיו
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.12} y={36}>
              <div className="overflow-hidden rounded-3xl shadow-card transition-transform duration-500 hover:-translate-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-5.jpg"
                  alt="תצוגת 360° של מרחב"
                  className="h-[28rem] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== STATS BAND ===================== */}
      <section className="bg-apricot-wash">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-20 text-center sm:grid-cols-3">
          {[
            { k: '2.7×', v: 'יותר זמן צפייה מול תמונות רגילות' },
            { k: '24/7', v: 'הנכס פתוח לביקור מכל מקום' },
            { k: '5 דק׳', v: 'מהעלאה ללינק מוכן לשיתוף' },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 0.12}>
              <p className="font-display text-heading font-bold text-ink sm:text-heading-lg">
                {s.k}
              </p>
              <p className="mt-3 text-body text-rust">{s.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== FEATURE 2 ===================== */}
      <section className="bg-pure-white">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <Reveal delay={0.12} y={36} className="md:order-2">
              <div className="rounded-3xl bg-sky-wash p-8 shadow-card sm:p-10">
                <p className="text-caption text-graphite">לינק לשיתוף</p>
                <p
                  dir="ltr"
                  className="mt-3 truncate rounded-2xl bg-pure-white px-5 py-4 font-mono text-body text-ink shadow-card"
                >
                  yourdomain.com/tour/abc123
                </p>
                <p className="mt-5 text-caption text-graphite">קוד הטמעה</p>
                <p
                  dir="ltr"
                  className="mt-3 truncate rounded-2xl bg-pure-white px-5 py-4 font-mono text-caption text-ash shadow-card"
                >
                  &lt;iframe src=&quot;.../tour/abc123&quot;&gt;
                </p>
              </div>
            </Reveal>
            <Reveal className="md:order-1">
              <div>
                <p className="text-caption font-semibold text-rust">שיתוף</p>
                <h2 className="mt-4 font-display text-heading-sm font-bold leading-[1.1] text-ink sm:text-heading">
                  לינק אחד. וקוד הטמעה לכל אתר.
                </h2>
                <p className="mt-5 text-body-lg text-ash">
                  כל סיור מקבל כתובת ייחודית וקוד iframe מוכן. משבצים באתר הלקוח,
                  שולחים בוואטסאפ, מצרפים למודעה — והנכס חי בכל מקום.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="bg-fog">
        <div className="mx-auto max-w-[1200px] px-6 py-28 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-heading font-bold leading-[1.1] text-ink sm:text-heading-lg">
              מוכנים לתת ללקוחות לצעוד פנימה?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-ash">
              התחילו מהסיור לדוגמה וראו איך זה מרגיש.
            </p>
            <div className="mt-10">
              <Link
                href="/tour/test"
                className="inline-block rounded-full bg-ink px-8 py-4 text-body font-medium text-pure-white transition hover:opacity-90 active:scale-95"
              >
                כניסה לסיור לדוגמה
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== FOOTER ===================== */}
      <footer className="border-t border-dove/40 bg-pure-white">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <p className="text-caption text-graphite">
            © {new Date().getFullYear()} סיורים וירטואליים 360°
          </p>
        </div>
      </footer>
    </main>
  )
}
