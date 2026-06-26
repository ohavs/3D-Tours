// ============================================================
// app/page.tsx — אתר שירות: צילום נכסים ובניית סיורים 360°.
// עיצוב אדיטוריאלי נועז: טיפוגרפיה ענקית, שחור/לבן דומיננטי,
// אקסנט כתום בודד, Light/Dark. הפונקציונליות והתוכן נשמרים.
// ============================================================

import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/anim'
import { ReactiveText, Magnetic } from '@/components/interactive'
import {
  ExperienceBand,
  StatsGhost,
  WipeDivider,
  ProcessThread,
} from '@/components/home-fx'
import Faq, { type FaqItem } from '@/components/Faq'
import ContactForm from '@/components/ContactForm'

const CONTACT_EMAIL = 'ohav88@gmail.com'
// TODO: להחליף למספר וואטסאפ אמיתי (פורמט בינלאומי, בלי +)
const WHATSAPP = '972500000000'

const FAQ_ITEMS: FaqItem[] = [
  { q: 'כמה זמן לוקח?', a: 'הצילום בנכס אורך כשעה-שעתיים, והסיור המוכן נשלח תוך עד 48 שעות.' },
  { q: 'מה אני מקבל בסוף?', a: 'לינק ייחודי לסיור + קוד הטמעה (iframe) שמשבצים באתר או במודעה.' },
  { q: 'זה עובד בנייד?', a: 'כן — הסיור רץ חלק בכל דפדפן ובכל מכשיר, בלי שום אפליקציה.' },
  { q: 'מה צריך להכין לפני הצילום?', a: 'שהנכס יהיה מסודר ומואר. את כל הציוד אני מביא.' },
  { q: 'אפשר לעדכן את הסיור בהמשך?', a: 'בהחלט — אפשר להוסיף, להחליף או לסדר מחדש חדרים בכל שלב.' },
]

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* ======================= HERO ======================= */}
      <section className="relative overflow-hidden">
        {/* רקע עדין: זוהר כתום + מרקם נקודות (מותאם-מצב) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-x-0 top-0 h-[460px]"
            style={{
              background:
                'radial-gradient(45% 60% at 50% 0%, rgba(255,104,44,0.12), transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              maskImage: 'linear-gradient(to bottom, black, transparent 65%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 65%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1240px] px-6 pb-20 pt-20 sm:pt-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" />
              צילום וסיורים 360° לנדל&quot;ן
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <ReactiveText
              as="h1"
              className="mt-6 font-display text-mega font-black leading-[0.9] tracking-tight text-foreground"
              text={'סורקים את הנכס.\nבונים את הסיור.'}
            />
          </Reveal>

          <div className="mt-10 grid items-end gap-12 md:grid-cols-[1fr_1.15fr]">
            <Reveal delay={0.16}>
              <div>
                <p className="max-w-md text-body-lg text-muted-foreground">
                  אני מגיע אליך, מצלם את הנכס ב-360°, ומקים סיור וירטואלי
                  אינטראקטיבי — עם לינק וקוד הטמעה מוכן לאתר שלך.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <Link
                      href="/tour/test"
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-body font-semibold text-background transition-opacity hover:opacity-85"
                    >
                      ראו דוגמה חיה
                      <ArrowLeft size={18} strokeWidth={2.4} />
                    </Link>
                  </Magnetic>
                  <Magnetic strength={0.25}>
                    <a
                      href="#contact"
                      className="inline-block rounded-full border border-border-strong px-6 py-3 text-body font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      דברו איתי
                    </a>
                  </Magnetic>
                </div>
              </div>
            </Reveal>

            {/* אלמנט הסיור היחיד */}
            <Reveal delay={0.15}>
              <Link
                href="/tour/test"
                className="group block overflow-hidden rounded-2xl border border-border bg-surface p-2.5 shadow-card"
              >
                <div className="relative overflow-hidden rounded-xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://photo-sphere-viewer-data.netlify.app/assets/tour/key-biscayne-3.jpg"
                    alt="תצוגת סיור 360°"
                    className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px]"
                  />
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-caption font-semibold text-foreground shadow-soft">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                    סיור חי 360°
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-card transition-transform group-hover:scale-110">
                      <ArrowLeft className="text-foreground" size={26} strokeWidth={2.4} />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* אפקט 1 — באנד חוויה (גרדיאנט חם רציף + זוהר כתום) */}
      <ExperienceBand />
      {/* אפקט 2 — מספרים עם כיתוב-רפאים "360°" ב-parallax */}
      <StatsGhost />
      {/* אפקט 4 — מעבר Wipe כתום */}
      <WipeDivider />
      {/* אפקט 3 — איך זה עובד (חוט כתום שמצייר את עצמו) */}
      <ProcessThread />

      {/* ===================== אודות (אזור מצב מתחלף) ===================== */}
      <section className="mx-auto max-w-[1240px] px-6 py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <ReactiveText
              as="h2"
              className="font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg"
              text={'קצת עליי'}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="group rounded-2xl p-6 transition-colors duration-500 hover:bg-accent/[0.08] sm:p-8">
              <p className="text-body-lg text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
                אני מצלם נכסים והופך אותם לסיורים וירטואליים 360° — שירות מלא
                מקצה לקצה: אני מגיע, סורק את הנכס, ובונה את הסיור עד שהוא מוכן
                להטמעה אצלך.
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex translate-y-1 items-center gap-1.5 text-body font-semibold text-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              >
                דברו איתי
                <ArrowLeft size={17} strokeWidth={2.4} />
              </a>
              <p className="mt-4 text-caption text-muted-foreground/70">
                * טקסט לדוגמה — שלח לי משפט-שניים אישיים ואחליף אותם כאן.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== מה מקבלים + קוד הטמעה ===================== */}
      <section className="mx-auto max-w-[1240px] px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal className="min-w-0">
            <div>
              <ReactiveText
                as="h2"
                className="font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg"
                text={'לינק אחד.\nומוטמע אצלך באתר.'}
              />
              <p className="mt-5 max-w-md text-body-lg text-muted-foreground">
                בסיום מקבלים כתובת ייחודית לסיור, וקוד הטמעה (iframe) שמשבצים
                ישירות במודעה או באתר — הסיור פשוט מופיע שם, חי.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="min-w-0">
            <div className="min-w-0 rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <span className="text-caption font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                קוד הטמעה
              </span>
              <pre
                dir="ltr"
                className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 text-[13px] leading-relaxed text-foreground"
              >
                <code>{`<iframe
  src="https://tour360.co.il/tour/abc123"
  width="100%" height="520"
  style="border:0;border-radius:12px"
  allowfullscreen
></iframe>`}</code>
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== מחירים ===================== */}
      <section id="pricing" className="mx-auto max-w-[1240px] px-6 py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <Reveal>
            <ReactiveText
              as="h2"
              className="font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg"
              text={'תמחור הוגן,\nלפי הנכס.'}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-body-lg text-muted-foreground">
                המחיר נקבע לפי גודל הנכס, מספר החדרים והמורכבות — בלי חבילות
                קשיחות. מקבלים הצעה מותאמת וברורה מראש, ללא הפתעות.
              </p>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-body font-semibold text-background transition-opacity hover:opacity-85"
              >
                לקבלת הצעת מחיר
                <ArrowLeft size={18} strokeWidth={2.4} />
              </a>
              <p className="mt-4 text-caption text-muted-foreground/70">
                * רוצה מחירים קבועים באתר? שלח לי טווחים ואבנה טבלת מחירים.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section id="faq" className="mx-auto max-w-[1240px] px-6 py-24">
        <Reveal>
          <ReactiveText
            as="h2"
            className="mb-10 block font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg"
            text={'שאלות נפוצות'}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Faq items={FAQ_ITEMS} />
        </Reveal>
      </section>

      {/* ===================== צור קשר ===================== */}
      <section id="contact" className="mx-auto max-w-[1240px] px-6 pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
            <div className="grid md:grid-cols-2">
              {/* פאנל היפוך אדיטוריאלי (שחור בבהיר, לבן בכהה) */}
              <div className="flex flex-col justify-between gap-10 bg-foreground p-8 sm:p-12">
                <div>
                  <h2 className="font-display text-heading font-black leading-[0.95] tracking-tight text-background sm:text-heading-lg">
                    יש לכם נכס?
                    <br />
                    בואו נדבר.
                  </h2>
                  <p className="mt-5 max-w-sm text-body-lg text-background/70">
                    מתאמים צילום, ואני דואג לכל השאר — עד סיור מוכן לשיתוף.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-body font-semibold text-accent-foreground transition-opacity hover:opacity-85"
                  >
                    <MessageCircle size={18} strokeWidth={2.2} />
                    וואטסאפ
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="rounded-full border border-background/30 px-6 py-3 text-body font-semibold text-background transition-colors hover:bg-background/10"
                  >
                    אימייל
                  </a>
                </div>
              </div>
              {/* פאנל הטופס */}
              <div className="p-8 sm:p-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-14 sm:grid-cols-2">
          <div>
            <span className="text-[22px] font-extrabold tracking-tight text-foreground">
              tour<span className="text-accent">.</span>360
            </span>
            <p className="mt-3 max-w-xs text-caption text-muted-foreground">
              שירות צילום וסיורים וירטואליים 360° לנדל&quot;ן.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-caption font-medium text-muted-foreground sm:justify-end">
              <a href="#service" className="hover:text-foreground">השירות</a>
              <a href="#pricing" className="hover:text-foreground">מחירים</a>
              <a href="#faq" className="hover:text-foreground">שאלות</a>
              <a href="#contact" className="hover:text-foreground">צור קשר</a>
              <Link href="/accessibility" className="hover:text-foreground">נגישות</Link>
            </div>
            <p className="text-caption text-muted-foreground/70">
              © {new Date().getFullYear()} tour.360 — כל הזכויות שמורות
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
