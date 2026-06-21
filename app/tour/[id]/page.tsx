// ============================================================
// app/tour/[id]/page.tsx
// דף הסיור. הכתובת /tour/<משהו> — למשל /tour/test.
//
// בשלב הזה הנתונים "קשיחים" (hardcoded). זהו סט סיור מקושר אמיתי
// (Photo Sphere Viewer demo) — 7 נקודות צילום של אותו מיקום, עם
// קואורדינטות GPS כך שהחצים על הרצפה ממוקמים נכון וצועדים ביניהן.
// בשלב הבא נחבר את הנתונים למסד הנתונים האמיתי.
// ============================================================

import Link from 'next/link'
import TourViewer from '@/components/TourViewer'
import type { TourNode } from '@/lib/types'

const BASE = 'https://photo-sphere-viewer-data.netlify.app/assets/tour/'

const TOUR_NODES: TourNode[] = [
  {
    id: '1',
    panorama: `${BASE}key-biscayne-1.jpg`,
    name: 'נקודה 1',
    gps: [-80.156479, 25.666725, 3],
    sphereCorrection: { pan: '33deg' },
    links: [{ nodeId: '2' }],
  },
  {
    id: '2',
    panorama: `${BASE}key-biscayne-2.jpg`,
    name: 'נקודה 2',
    gps: [-80.156168, 25.666623, 3],
    sphereCorrection: { pan: '42deg' },
    links: [{ nodeId: '3' }, { nodeId: '1' }],
  },
  {
    id: '3',
    panorama: `${BASE}key-biscayne-3.jpg`,
    name: 'נקודה 3',
    gps: [-80.155932, 25.666498, 5],
    sphereCorrection: { pan: '50deg' },
    links: [{ nodeId: '4' }, { nodeId: '2' }, { nodeId: '5' }],
  },
  {
    id: '4',
    panorama: `${BASE}key-biscayne-4.jpg`,
    name: 'נקודה 4',
    gps: [-80.156089, 25.666357, 3],
    sphereCorrection: { pan: '-78deg' },
    links: [{ nodeId: '3' }, { nodeId: '5' }],
  },
  {
    id: '5',
    panorama: `${BASE}key-biscayne-5.jpg`,
    name: 'נקודה 5',
    gps: [-80.156292, 25.666446, 2],
    sphereCorrection: { pan: '170deg' },
    links: [{ nodeId: '6' }, { nodeId: '3' }, { nodeId: '4' }],
  },
  {
    id: '6',
    panorama: `${BASE}key-biscayne-6.jpg`,
    name: 'נקודה 6',
    gps: [-80.156465, 25.666496, 2],
    sphereCorrection: { pan: '65deg' },
    links: [{ nodeId: '5' }, { nodeId: '7' }],
  },
  {
    id: '7',
    panorama: `${BASE}key-biscayne-7.jpg`,
    name: 'נקודה 7',
    gps: [-80.15707, 25.6665, 3],
    sphereCorrection: { pan: '110deg' },
    links: [{ nodeId: '6' }],
  },
]

// בגרסה החדשה של Next.js, params הוא Promise ולכן צריך await.
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
        <TourViewer nodes={TOUR_NODES} startNodeId="1" />
      </div>
    </main>
  )
}
