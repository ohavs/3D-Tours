// ============================================================
// app/page.tsx — דף הבית (סגנון Steep)
// קנבס לבן נקי, זוהר אפרסק ב-hero, כרטיסים מעוגלים גדולים עם צל
// חתימה, אקסנט חלודה בודד, וכרטיסי wash (אפרסק/תכלת) לנתונים.
// ============================================================

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ======================= HERO ======================= */}
      <section className="relative overflow-hidden">
        {/* זוהר אפרסק רדיאלי — רק ב-hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(58% 50% at 50% 22%, #fbe1d1 0%, rgba(251,225,209,0) 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-20 sm:pt-28">
          <div className="text-center">
            <span className="inline-block rounded-full border border-dove/60 bg-pure-white px-4 py-1.5 text-caption font-medium text-ash">
              סיורי 360° לנדל&quot;ן
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-heading font-semibold text-ink sm:text-heading-lg">
              סיורים וירטואליים שמוכרים נכסים
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-ash">
              חוויית 360° אינטראקטיבית לכל נכס. הלקוחות מסתובבים בחדרים מכל מקום,
              בכל שעה — עוד לפני שדרכו כף רגל בדלת.
            </p>
            <div className="mt-8 flex items-center justify-center gap-5">
              <Link
                href="/tour/test"
                className="rounded-full bg-ink px-6 py-3 text-body font-medium text-pure-white transition hover:opacity-90"
              >
                צפו בסיור לדוגמה
              </Link>
              <Link
                href="#how"
                className="text-body font-medium text-ink transition hover:opacity-70"
              >
                איך זה עובד ←
              </Link>
            </div>
          </div>

          {/* כרטיס תצוגה מקדימה של "המוצר" — כרטיס לבן גדול עם צל חתימה */}
          <div className="relative mx-auto mt-16 max-w-4xl rounded-3xl bg-pure-white p-3 shadow-card">
            {/* פס כלים מדומה */}
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="h-3 w-3 rounded-full bg-dove/70" />
              <span className="h-3 w-3 rounded-full bg-dove/50" />
              <span className="h-3 w-3 rounded-full bg-dove/40" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
              {/* סרגל צד — רשימת חדרים */}
              <div className="rounded-2xl bg-fog p-4">
                <p className="text-caption text-graphite">חדרים</p>
                <ul className="mt-3 space-y-1.5 text-body text-ink">
                  {['סלון', 'מטבח', 'חצר'].map((r, i) => (
                    <li
                      key={r}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                        i === 0 ? 'bg-pure-white shadow-card' : ''
                      }`}
                    >
                      <span>{r}</span>
                      <span className="text-graphite">›</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* "חלון" התצוגה — תמונת 360° אמיתית */}
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://pannellum.org/images/alma.jpg"
                  alt="תצוגה מקדימה של סיור 360°"
                  className="h-64 w-full object-cover sm:h-80"
                />
                {/* תווית "חץ ניווט" מדומה מעל התמונה */}
                <span className="absolute bottom-6 right-1/2 translate-x-1/2 rounded-full bg-pure-white px-4 py-2 text-caption font-semibold text-ink shadow-card">
                  למטבח ←
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="bg-pure-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* טקסט */}
            <div>
              <p className="text-caption font-medium text-rust">למה זה עובד</p>
              <h2 className="mt-3 font-display text-heading-sm font-semibold text-ink sm:text-heading">
                נכס שאפשר להסתובב בתוכו נמכר מהר יותר
              </h2>
              <p className="mt-4 text-body-lg text-ash">
                תמונה סטטית מראה זווית אחת. סיור 360° נותן ללקוח להרגיש את החלל,
                את האור ואת הפרופורציות — וזה מה שמקצר את הדרך להחלטה.
              </p>
            </div>
            {/* שני כרטיסי wash — שפת כרטיסי הנתונים */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl bg-apricot-wash p-6 shadow-card">
                <p className="text-caption text-rust">צפיות החודש</p>
                <p className="mt-2 font-display text-heading-sm font-semibold text-ink">
                  1,248
                </p>
                <p className="mt-1 text-caption text-ash">+18% מהחודש שעבר</p>
              </div>
              <div className="rounded-3xl bg-sky-wash p-6 shadow-card">
                <p className="text-caption text-graphite">זמן בסיור</p>
                <p className="mt-2 font-display text-heading-sm font-semibold text-ink">
                  2:47
                </p>
                <p className="mt-1 text-caption text-ash">דקות בממוצע לביקור</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== HOW IT WORKS =================== */}
      <section id="how" className="bg-fog">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <h2 className="font-display text-heading-sm font-semibold text-ink sm:text-heading">
            שלושה צעדים מצילום ללינק
          </h2>
          <p className="mt-3 max-w-xl text-body-lg text-ash">
            כל חדר הוא סצנת 360°, והחצים מחברים ביניהם לניווט חלק — בדיוק כמו
            בסיור לדוגמה.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                n: '01',
                t: 'מצלמים את הנכס',
                d: 'תמונת 360° לכל חדר (כרגע: תמונות בדיקה מהאינטרנט).',
              },
              {
                n: '02',
                t: 'מחברים חדרים',
                d: 'מוסיפים חצי ניווט (hotspots) שמקשרים בין החדרים.',
              },
              {
                n: '03',
                t: 'משתפים לינק',
                d: 'הלקוח מקבל לינק ייחודי + קוד הטמעה לאתר שלו.',
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-3xl bg-pure-white p-6 shadow-card"
              >
                <p className="font-display text-heading-sm font-semibold text-rust">
                  {step.n}
                </p>
                <h3 className="mt-3 text-subheading font-semibold text-ink">
                  {step.t}
                </h3>
                <p className="mt-2 text-body text-ash">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CLOSING CTA =================== */}
      <section className="bg-pure-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-heading-sm font-semibold text-ink sm:text-heading">
            רוצים לראות איך זה מרגיש?
          </h2>
          <div className="mt-7">
            <Link
              href="/tour/test"
              className="rounded-full bg-ink px-6 py-3 text-body font-medium text-pure-white transition hover:opacity-90"
            >
              כניסה לסיור לדוגמה
            </Link>
          </div>
        </div>
      </section>

      {/* ====================== FOOTER ===================== */}
      <footer className="border-t border-dove/40 bg-fog">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <p className="text-caption text-graphite">
            © {new Date().getFullYear()} סיורים וירטואליים 360°
          </p>
        </div>
      </footer>
    </main>
  )
}
