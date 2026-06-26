// ============================================================
// app/accessibility/page.tsx — הצהרת נגישות (ת"י 5568 / WCAG 2.0 AA).
// נכתבה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות
// לשירות), התשע"ג-2013. *יש להחליף את פרטי הטלפון של רכז הנגישות.*
// ============================================================

import type { Metadata } from 'next'
import { Mail, MessageCircle, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'הצהרת נגישות | tour.360',
  description: 'הצהרת הנגישות של אתר tour.360 — שירות צילום וסיורים וירטואליים 360° לנדל"ן.',
}

// TODO: להחליף למספר טלפון/וואטסאפ אמיתי של רכז הנגישות
const PHONE = '972500000000'
const EMAIL = 'ohav88@gmail.com'
const LAST_UPDATED = '26 ביוני 2026'

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 font-display text-heading-sm font-extrabold tracking-tight text-foreground">
      {children}
    </h2>
  )
}

export default function AccessibilityStatement() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-caption font-semibold text-accent">
        <ShieldCheck size={16} /> נגישות
      </span>
      <h1 className="mt-5 font-display text-heading font-black tracking-tight text-foreground sm:text-heading-lg">
        הצהרת נגישות
      </h1>

      <p className="mt-6 text-body-lg leading-relaxed text-muted-foreground">
        אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים, ופועלים כדי שאתר
        זה יהיה נגיש לאנשים עם מוגבלות. הנגשת האתר נעשתה מתוך אמונה שלכל אדם
        מגיעה הזכות לחיות בשוויון, כבוד, נוחות ועצמאות.
      </p>

      <H2>רמת הנגישות באתר</H2>
      <p className="mt-4 text-body leading-relaxed text-muted-foreground">
        האתר נבנה בהתאם להנחיות התקן הישראלי{' '}
        <strong className="text-foreground">ת&quot;י 5568</strong> לנגישות תכנים
        באינטרנט, ברמת <strong className="text-foreground">AA</strong>, ובהתאם
        למסמך הבינלאומי <span dir="ltr">WCAG 2.0</span>. כמו כן נעשתה התאמה
        לדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
        התשע&quot;ג-2013.
      </p>

      <H2>מה הונגש באתר</H2>
      <ul className="mt-4 space-y-2.5 text-body text-muted-foreground">
        {[
          'מבנה סמנטי תקין (כותרות, רשימות, אזורי ניווט) לקוראי מסך.',
          'ניווט מלא באמצעות מקלדת, עם סימון פוקוס ברור לכל רכיב.',
          'קישור "דלג לתוכן הראשי" בתחילת כל עמוד.',
          'טקסט חלופי לתמונות ותוויות (labels) לשדות טופס.',
          'ניגודיות צבעים תקינה בין טקסט לרקע, במצב בהיר ובמצב כהה.',
          'תאימות מלאה למובייל ולמגוון גדלי מסך.',
          'אפשרות לעצור אנימציות והתחשבות בהעדפת מערכת לצמצום תנועה.',
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {t}
          </li>
        ))}
      </ul>

      <H2>תפריט הנגישות</H2>
      <p className="mt-4 text-body leading-relaxed text-muted-foreground">
        בכל עמוד באתר מופיע כפתור נגישות קבוע (בפינה השמאלית התחתונה) הפותח
        תפריט התאמות אישיות, הכולל:
      </p>
      <ul className="mt-4 grid gap-2.5 text-body text-muted-foreground sm:grid-cols-2">
        {[
          'הגדלה והקטנה של גודל הטקסט',
          'ניגודיות גבוהה',
          'גווני אפור',
          'היפוך צבעים',
          'ריווח שורות מוגדל',
          'הדגשת קישורים',
          'הדגשת כותרות',
          'פונט קריא',
          'מדריך קריאה',
          'עצירת אנימציות',
          'סמן עכבר גדול',
          'איפוס הגדרות',
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {t}
          </li>
        ))}
      </ul>

      <H2>מגבלות נגישות ידועות</H2>
      <p className="mt-4 text-body leading-relaxed text-muted-foreground">
        חרף מאמצינו לאפשר גלישה נגישה מכלל חלקי האתר, ייתכנו חלקים שטרם הונגשו
        במלואם:
      </p>
      <ul className="mt-4 space-y-2.5 text-body text-muted-foreground">
        {[
          'נגן הסיור הווירטואלי (360°) הוא חוויה חזותית-אינטראקטיבית אימרסיבית, ולכן ייתכן שחלק מתכניו אינם נגישים באופן מלא לקוראי מסך או לניווט מקלדת. אנו זמינים לספק את המידע על הנכס גם בערוצים חלופיים — ראו פרטי יצירת קשר למטה.',
          'באתר עשוי להופיע תוכן של צד שלישי שאינו בשליטתנו המלאה.',
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {t}
          </li>
        ))}
      </ul>

      <H2>פניות בנושא נגישות</H2>
      <p className="mt-4 text-body leading-relaxed text-muted-foreground">
        נתקלתם בבעיית נגישות, או שאתם זקוקים למידע על נכס בערוץ חלופי? נשמח
        לסייע. ניתן לפנות אל רכז הנגישות שלנו, ונעשה כמיטב יכולתנו להיענות
        בהקדם (בדרך כלל תוך 5 ימי עסקים):
      </p>
      <div className="mt-5 rounded-2xl border border-border bg-surface p-6">
        <p className="text-body font-semibold text-foreground">אוהב — רכז נגישות</p>
        <div className="mt-4 flex flex-col gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2.5 text-body font-medium text-foreground transition-colors hover:text-accent"
          >
            <Mail size={18} className="text-accent" />
            {EMAIL}
          </a>
          <a
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-body font-medium text-foreground transition-colors hover:text-accent"
          >
            <MessageCircle size={18} className="text-accent" />
            וואטסאפ
          </a>
        </div>
      </div>

      <p className="mt-12 border-t border-border pt-6 text-caption text-muted-foreground">
        הצהרת הנגישות עודכנה לאחרונה בתאריך {LAST_UPDATED}. אנו ממשיכים לשפר את
        נגישות האתר באופן שוטף.
      </p>
    </main>
  )
}
