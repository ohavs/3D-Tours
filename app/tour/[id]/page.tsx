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
import type { ViewerScene, ViewerHotspot } from '@/lib/types'

// "טיול" במקום אחד קוהרנטי: סדרת נקודות צילום סמוכות של אותו מיקום
// (סט הסיור הציבורי של Photo Sphere Viewer). במקום לדלג בין תמונות
// זרות — צועדים קדימה ואחורה לאורך מסלול, עם חצים על הרצפה.
const BASE = 'https://photo-sphere-viewer-data.netlify.app/assets/tour/'
const POINT_COUNT = 6

// בונים שרשרת: כל נקודה מחוברת לקודמת ולבאה אחריה.
// חץ "קדימה" במרכז התצוגה (yaw 0) ונמוך לכיוון הרצפה (pitch -32),
// חץ "אחורה" מאחור (yaw 180). targetYaw שומר על אותו כיוון תנועה.
const TEST_SCENES: ViewerScene[] = Array.from(
  { length: POINT_COUNT },
  (_, i) => {
    const n = i + 1
    const hotSpots: ViewerHotspot[] = []
    if (n < POINT_COUNT) {
      hotSpots.push({
        pitch: -32,
        yaw: 0,
        text: 'קדימה',
        targetSceneId: `point-${n + 1}`,
        targetYaw: 0,
      })
    }
    if (n > 1) {
      hotSpots.push({
        pitch: -32,
        yaw: 180,
        text: 'אחורה',
        targetSceneId: `point-${n - 1}`,
        targetYaw: 180,
      })
    }
    return {
      id: `point-${n}`,
      title: `נקודה ${n} מתוך ${POINT_COUNT}`,
      panorama: `${BASE}key-biscayne-${n}.jpg`,
      hotSpots,
    }
  },
)

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
        <PannellumViewer scenes={TEST_SCENES} firstSceneId="point-1" />
      </div>
    </main>
  )
}
