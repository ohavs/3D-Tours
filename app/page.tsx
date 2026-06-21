// ============================================================
// app/page.tsx — דף הבית
// בנוי לפי מערכת העיצוב: hero מלא־מסך עם כרטיס זכוכית מטושטשת,
// ואחריו מקטע עריכותי לבן (Paper) עם כותרת serif גדולה.
// בשלב מאוחר יותר נוסיף כאן את גלריית הסיורים האמיתית.
// ============================================================

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ---------- HERO מלא־מסך ---------- */}
      <section className="relative min-h-[92vh] w-full overflow-hidden">
        {/* רקע — נוף 360° אמיתי (תמונת בדיקה). תמונה רגילה, לא next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://pannellum.org/images/cerro-toco-0.jpg"
          alt="נוף פתוח בתצוגת 360°"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* שכבת כהות עדינה בתחתית — לקריאוּת הטקסט הלבן */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {/* כרטיס הזכוכית המטושטשת */}
        <div className="relative z-10 flex min-h-[92vh] items-end p-6 sm:p-12">
          <div className="max-w-md rounded-hero border border-white/25 bg-white/10 p-6 shadow-frosted backdrop-blur-md">
            <h1 className="font-display text-heading-lg font-normal text-white">
              סיורים וירטואליים שמוכרים נכסים
            </h1>
            <p className="mt-3 text-body-sm text-white/90">
              חוויית 360° אינטראקטיבית לכל נכס. הלקוחות מסתובבים בחדרים מכל מקום,
              בכל שעה — עוד לפני שדרכו כף רגל בדלת.
            </p>
            <Link
              href="/tour/test"
              className="mt-5 inline-flex items-center gap-1 text-body-sm font-medium text-white underline decoration-1 underline-offset-4 transition hover:opacity-80"
            >
              צפו בסיור לדוגמה <span aria-hidden>←</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- מקטע עריכותי לבן ---------- */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:items-start">
            {/* תווית צד + טקסט מושתק */}
            <div>
              <p className="text-caption font-bold text-iron">למה סיור וירטואלי</p>
              <p className="mt-3 text-body-sm text-steel">
                תמונה סטטית מראה זווית אחת. סיור 360° נותן ללקוח להרגיש את החלל,
                את האור ואת הפרופורציות — וזה מה שמקצר את הדרך להחלטה.
              </p>
            </div>

            {/* כותרת serif גדולה עם קישור כחול בתוך המשפט */}
            <h2 className="font-display text-heading font-normal text-ink">
              נכס ש
              <Link
                href="/tour/test"
                className="text-hudson-blue underline decoration-1 underline-offset-4"
              >
                אפשר להסתובב בתוכו
              </Link>{' '}
              נמכר מהר יותר מנכס שרואים רק בתמונה.
            </h2>
          </div>

          {/* כרטיס "דיאגרמה" — ריבועים מתארים שלושה חדרים מקושרים */}
          <div className="mt-12 rounded-elevated border border-sage bg-paper p-8 shadow-card">
            <p className="text-caption font-bold text-iron">איך זה עובד</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {['סלון', 'מטבח', 'חדר שינה'].map((room, i, arr) => (
                <div key={room} className="flex items-center gap-4">
                  <div className="flex h-20 w-28 items-center justify-center rounded-card border border-ink/70 text-body-sm text-ink">
                    {room}
                  </div>
                  {i < arr.length - 1 && (
                    <span aria-hidden className="text-steel">
                      ←
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-lg text-body-sm text-steel">
              כל חדר הוא סצנת 360°, והחצים (hotspots) מחברים ביניהם לניווט חלק —
              בדיוק כמו בסיור לדוגמה.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- פוטר עדין ---------- */}
      <footer className="border-t border-sage bg-linen">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <p className="text-caption text-steel">
            © {new Date().getFullYear()} סיורים וירטואליים 360°
          </p>
        </div>
      </footer>
    </main>
  )
}
