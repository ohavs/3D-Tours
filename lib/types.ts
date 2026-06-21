// ============================================================
// lib/types.ts
// כל הטיפוסים (Types) של הפרויקט במקום אחד.
// טיפוס = "תבנית" שמתארת איך אובייקט אמור להיראות, כדי ש-TypeScript
// יתפוס שגיאות עוד לפני שהקוד רץ.
// ============================================================

// --- הטיפוסים של מסד הנתונים (כמו שהם נשמרים ב-Supabase) ---

/** סיור שלם (נכס אחד) */
export interface Tour {
  id: string
  title: string
  slug: string
  description?: string
  thumbnail_url?: string
  is_public: boolean
  created_at: string
  updated_at: string
  scenes?: TourScene[]
}

/** סצנה = חדר בודד בתוך סיור (תמונת 360° אחת) */
export interface TourScene {
  id: string
  tour_id: string
  title: string
  image_url: string
  order_index: number
  hotspots: Hotspot[]
  created_at: string
}

/** Hotspot = נקודת ניווט (חץ) שלוחצים עליה כדי לעבור לחדר אחר */
export interface Hotspot {
  id: string
  pitch: number // זווית אנכית (-90 עד 90)
  yaw: number // זווית אופקית (-180 עד 180)
  target_scene_id: string
  text: string
}

// --- הטיפוסים שה-Viewer (PannellumViewer) מקבל ---
// אלו טיפוסים "נקיים" שמתאימים בדיוק למה שהקומפוננטה צריכה,
// בלי תלות במבנה של מסד הנתונים.

/** סצנה אחת כפי שה-Viewer מצפה לקבל */
export interface ViewerScene {
  id: string
  title: string
  panorama: string // כתובת התמונה (URL)
  hotSpots?: ViewerHotspot[]
}

/** Hotspot כפי שה-Viewer מצפה לקבל */
export interface ViewerHotspot {
  pitch: number
  yaw: number
  text: string
  targetSceneId: string // לאיזו סצנה החץ הזה מוביל
  // לאיזה כיוון להסתכל אחרי המעבר — שומר על תחושת "המשכתי באותו כיוון"
  targetYaw?: number
  targetPitch?: number
}

// --- Photo Sphere Viewer: צומת (נקודת צילום) בסיור מקושר ---
// כל צומת היא תמונת 360° במיקום מסוים, עם קישורים לצמתים שכנים.
// במצב GPS, החצים על הרצפה ממוקמים אוטומטית לפי הקואורדינטות,
// כך שלוחצים על חץ "שמוביל לכיוון" ומרגישים שצועדים קדימה.
export interface TourNode {
  id: string
  panorama: string // כתובת תמונת ה-360°
  name?: string // שם הנקודה (מופיע ב-tooltip)
  thumbnail?: string
  // קואורדינטות [אורך, רוחב] ואופציונלי גובה — לצורך מיקום החצים
  gps: [number, number] | [number, number, number]
  // תיקון סיבוב התמונה כדי שתהיה מיושרת נכון (צפון אמיתי)
  sphereCorrection?: { pan?: string; tilt?: string; roll?: string }
  links: { nodeId: string }[] // לאילו צמתים אפשר לעבור מכאן
}
