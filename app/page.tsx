// ============================================================
// app/page.tsx
// דף הבית (הכתובת הראשית "/").
// בשלב הזה הוא פשוט מסך פתיחה עם קישור לסיור הבדיקה.
// בשלב מאוחר יותר (שלב 7) נהפוך אותו לגלריית סיורים אמיתית.
// ============================================================

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="max-w-xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          סיורים וירטואליים 360°
        </h1>
        <p className="text-lg text-neutral-500">
          פלטפורמה להצגת נכסי נדל&quot;ן בחוויית סיור אינטראקטיבית. כל סיור מקבל
          לינק ייחודי וקוד הטמעה לאתר.
        </p>
      </div>

      <Link
        href="/tour/test"
        className="rounded-full bg-neutral-900 px-8 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
      >
        צפו בסיור לדוגמה ←
      </Link>

      <p className="text-sm text-neutral-400">
        טיפ: גררו את העכבר בתוך הסיור כדי להסתובב, וגלגלת העכבר לזום.
      </p>
    </main>
  )
}
