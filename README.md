# 3D-Tours — פלטפורמת סיורים וירטואליים 360°

פלטפורמה להצגת נכסי נדל"ן בחוויית סיור 360° אינטראקטיבי.
כל סיור מקבל לינק ייחודי + קוד הטמעה (iframe) לאתר הלקוח.

## טכנולוגיות

- **Next.js 16** (App Router) — Frontend + Backend
- **TypeScript + Tailwind CSS v4**
- **Pannellum.js** (נטען מ-CDN) — ה-Viewer של 360°
- **Supabase** (PostgreSQL) — מסד נתונים _(יתווסף בשלב הבא)_
- **Cloudflare R2** — אחסון תמונות _(יתווסף בשלב הבא)_

## מה כבר עובד (שלב 2)

- דף בית עם קישור לסיור לדוגמה
- דף סיור 360° עובד עם תמונות בדיקה + ניווט בין שני חדרים (hotspots)

## איך מריצים מקומית

> צריך **Node.js 18+** מותקן. להורדה: https://nodejs.org (בחר את גרסת ה-LTS).

```bash
# 1. התקנת החבילות (פעם אחת)
npm install

# 2. הפעלת שרת הפיתוח
npm run dev
```

ואז פותחים בדפדפן:

- דף הבית: http://localhost:3000
- סיור לדוגמה: http://localhost:3000/tour/test

בתוך הסיור: גוררים עם העכבר כדי להסתובב, גלגלת לזום, ולוחצים על
החצים כדי לעבור בין החדרים.

## מבנה התיקיות

```
app/
  page.tsx              # דף הבית
  layout.tsx            # מעטפת כללית (עברית, RTL)
  tour/[id]/page.tsx    # דף הסיור 360°
components/
  PannellumViewer.tsx   # קומפוננטת ה-Viewer (טוענת Pannellum מ-CDN)
lib/
  types.ts              # כל הטיפוסים של הפרויקט
```
