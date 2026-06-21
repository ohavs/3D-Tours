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

// מרחב בדיקה של 3 חדרים מקושרים זה לזה (כל חדר מגיע לשני האחרים),
// כדי לוודא שכל מנגנון הניווט עובד — קדימה, אחורה, וצומת עם 2 יציאות.
// אלו תמונות 360° חינמיות מהאינטרנט שמשמשות כ"חדרים" עד שיהיו צילומים.
const TEST_SCENES: ViewerScene[] = [
  {
    id: 'living-room',
    title: 'סלון',
    panorama: 'https://pannellum.org/images/alma.jpg',
    // pitch/yaw קובעים את מיקום החץ בכדור ה-360°. שתי היציאות
    // ממוקמות סביב מרכז התצוגה הראשונית כדי שייראו מיד.
    hotSpots: [
      { pitch: -4, yaw: -25, text: 'למטבח', targetSceneId: 'kitchen' },
      { pitch: -4, yaw: 25, text: 'לחצר', targetSceneId: 'garden' },
    ],
  },
  {
    id: 'kitchen',
    title: 'מטבח',
    panorama: 'https://pannellum.org/images/cerro-toco-0.jpg',
    hotSpots: [
      { pitch: -4, yaw: -25, text: 'לסלון', targetSceneId: 'living-room' },
      { pitch: -4, yaw: 25, text: 'לחצר', targetSceneId: 'garden' },
    ],
  },
  {
    id: 'garden',
    title: 'חצר',
    // תמונת סיור ציבורית ידועה (Photo Sphere Viewer). אם החדר הזה
    // יוצא ריק — סימן שהמארח חסום, ואז נחליף לתמונה אחרת.
    panorama:
      'https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-1.jpg',
    hotSpots: [
      { pitch: -4, yaw: -25, text: 'לסלון', targetSceneId: 'living-room' },
      { pitch: -4, yaw: 25, text: 'למטבח', targetSceneId: 'kitchen' },
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
      {/* פס עליון לבן נקי (סגנון Steep) */}
      <header className="flex items-center justify-between border-b border-dove/40 bg-pure-white px-5 py-3">
        <h1 className="font-display text-subheading font-semibold text-ink">
          סיור לדוגמה
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-caption text-graphite">מזהה: {id}</span>
          <Link
            href="/"
            className="flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-caption font-medium text-pure-white transition hover:opacity-90"
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
