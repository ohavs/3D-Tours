// ============================================================
// app/tour/[id]/page.tsx
// דף הסיור. הכתובת היא /tour/<משהו> — למשל /tour/test
// ה-[id] בשם התיקייה הוא "פרמטר דינמי": כל ערך שיבוא בכתובת
// יתקבל כאן בתוך params.
//
// בשלב הזה (שלב 2) הנתונים "קשיחים" (hardcoded) — כתובים ידנית
// בקוד. בשלב הבא נחבר את זה למסד הנתונים האמיתי.
// ============================================================

import Link from 'next/link'
import PannellumViewer from '@/components/PannellumViewer'
import type { ViewerScene } from '@/lib/types'

// שתי תמונות 360° חינמיות לבדיקה (אותו פורמט כמו ה-Insta360)
const TEST_SCENES: ViewerScene[] = [
  {
    id: 'living-room',
    title: 'סלון',
    panorama: 'https://pannellum.org/images/alma.jpg',
    // חץ ניווט: מהסלון אפשר לעבור ל"מרפסת".
    // pitch/yaw קובעים את מיקום החץ בכדור ה-360°. ערכים קרובים ל-0
    // ממקמים אותו במרכז התצוגה הראשונית, כך שרואים אותו מיד.
    hotSpots: [
      {
        pitch: -8,
        yaw: 5,
        text: 'מעבר למרפסת',
        targetSceneId: 'balcony',
      },
    ],
  },
  {
    id: 'balcony',
    title: 'מרפסת',
    panorama: 'https://pannellum.org/images/cerro-toco-0.jpg',
    // חץ חזרה לסלון
    hotSpots: [
      {
        pitch: -8,
        yaw: 5,
        text: 'חזרה לסלון',
        targetSceneId: 'living-room',
      },
    ],
  },
]

// שימו לב: בגרסה החדשה של Next.js, params הוא "הבטחה" (Promise)
// ולכן צריך await כדי לקרוא ממנו.
export default async function TourPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // h-[100dvh] = גובה מלא של המסך (גם במובייל), כדי שלViewer
  // תמיד יהיה גובה אמיתי לצייר בתוכו.
  return (
    <main className="flex h-[100dvh] flex-col">
      {/* פס עליון עם שם הסיור */}
      {/* פס עליון כהה תואם למערכת העיצוב */}
      <header className="flex items-center justify-between bg-graphite-night px-5 py-3 text-paper">
        <h1 className="font-display text-subheading font-medium">סיור לדוגמה</h1>
        <div className="flex items-center gap-4">
          <span className="text-caption text-paper/60">מזהה: {id}</span>
          <Link
            href="/"
            className="flex items-center gap-1 rounded-button bg-obsidian px-3 py-1.5 text-caption font-medium text-paper transition hover:opacity-90"
          >
            <span aria-hidden>→</span> חזרה לאתר
          </Link>
        </div>
      </header>

      {/* הViewer עצמו — תופס את כל שאר המסך */}
      <div className="relative min-h-0 flex-1">
        <PannellumViewer scenes={TEST_SCENES} firstSceneId="living-room" />
      </div>
    </main>
  )
}
