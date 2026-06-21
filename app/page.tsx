// ============================================================
// app/page.tsx — דף הבית (סגנון Steep)
// hero על קנבס לבן עם זוהר אפרסק רך וכרטיסים צפים,
// ואחריו מקטע Fog שמסביר איך זה עובד בכרטיסים מעוגלים.
// ============================================================

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        {/* זוהר אפרסק רדיאלי — רק ב-hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 28%, #fbe1d1 0%, rgba(251,225,209,0) 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1200px] px-6 pb-24 pt-24 text-center sm:pt-32">
          <h1 className="mx-auto max-w-3xl font-display text-heading font-medium text-ink sm:text-heading-lg">
            סיורים וירטואליים שמוכרים נכסים
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-ash">
            חוויית 360° אינטראקטיבית לכל נכס. הלקוחות מסתובבים בחדרים מכל מקום,
            בכל שעה — עוד לפני שדרכו כף רגל בדלת.
          </p>

          {/* קבוצת פעולה: כפתור כהה יחיד + קישור טקסט */}
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

          {/* כרטיסים צפים (מוסתרים במובייל) — רומזים על תוכן המוצר */}
          <div className="relative mx-auto mt-16 hidden h-64 max-w-4xl lg:block">
            {/* כרטיס "חדרים" */}
            <div className="absolute right-0 top-4 w-56 rounded-3xl bg-pure-white p-5 text-right shadow-card">
              <p className="text-caption text-graphite">חדרי הסיור</p>
              <ul className="mt-3 space-y-2 text-body text-ink">
                <li className="flex items-center justify-between">
                  <span>סלון</span> <span className="text-graphite">›</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>מטבח</span> <span className="text-graphite">›</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>חדר שינה</span> <span className="text-graphite">›</span>
                </li>
              </ul>
            </div>

            {/* כרטיס סטטיסטיקה (warm wash) */}
            <div className="absolute left-2 top-0 w-48 rounded-3xl bg-apricot-wash p-5 text-right shadow-card">
              <p className="text-caption text-rust">צפיות החודש</p>
              <p className="mt-2 font-display text-heading-sm font-semibold text-ink">
                1,248
              </p>
              <p className="mt-1 text-caption text-ash">+18% מהחודש שעבר</p>
            </div>

            {/* כרטיס "שיתוף" (cool wash) */}
            <div className="absolute bottom-0 left-24 w-60 rounded-3xl bg-sky-wash p-5 text-right shadow-card">
              <p className="text-caption text-graphite">לינק לשיתוף</p>
              <p className="mt-2 truncate font-mono text-body text-ink" dir="ltr">
                yourdomain.com/tour/abc123
              </p>
              <p className="mt-2 text-caption text-ash">
                כולל קוד הטמעה (iframe) לאתר הלקוח
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- מקטע "איך זה עובד" (Fog) ---------- */}
      <section id="how" className="bg-fog">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <h2 className="font-display text-heading-sm font-medium text-ink sm:text-heading">
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

      {/* ---------- פוטר ---------- */}
      <footer className="border-t border-dove/40 bg-pure-white">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <p className="text-caption text-graphite">
            © {new Date().getFullYear()} סיורים וירטואליים 360°
          </p>
        </div>
      </footer>
    </main>
  )
}
