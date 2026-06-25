// ============================================================
// app/v2/page.tsx — גרסה חדשה של דף הבית (להשוואה מול "/").
// נבנתה מאפס לפי ui-ux-pro-max: Hero-Centric full-bleed אימרסיבי,
// social-proof לפני CTA. מינימליזם אדיטוריאלי נועז, Light/Dark,
// אקסנט כתום בודד, פונט Discovery FS, תנועה מאוזנת.
// ============================================================

import Link from 'next/link'
import {
  ArrowLeft,
  ChevronDown,
  MessageCircle,
  CalendarCheck,
  Camera,
  Boxes,
  Link2,
  Quote,
} from 'lucide-react'
import { Reveal, CountUp } from '@/components/anim'
import Faq, { type FaqItem } from '@/components/Faq'
import ContactForm from '@/components/ContactForm'

const CONTACT_EMAIL = 'ohav88@gmail.com'
const WHATSAPP = '972500000000'

const BASE = 'https://photo-sphere-viewer-data.netlify.app/assets/tour/'
const HERO_IMG = `${BASE}key-biscayne-1.jpg`

const STEPS = [
  { n: '01', icon: CalendarCheck, t: 'מתאמים', d: 'קובעים מועד שנוח לך. אני מגיע עם כל הציוד — בלי שתצטרך להכין כלום מעבר לסידור הנכס.' },
  { n: '02', icon: Camera, t: 'מצלם בנכס', d: 'סריקת 360° של כל החדרים, כולל תקרה ורצפה. הצילום אורך כשעה-שעתיים בלבד.' },
  { n: '03', icon: Boxes, t: 'בונה את הסיור', d: 'מחבר את החדרים לסיור אינטראקטיבי חלק, עם נקודות מעבר ועיצוב נקי.' },
  { n: '04', icon: Link2, t: 'מקבלים לינק', d: 'תוך 48 שעות: לינק ייחודי וקוד הטמעה מוכן לאתר או למודעה.' },
]

const GALLERY = [
  { img: `${BASE}key-biscayne-2.jpg`, title: 'סלון ומטבח' },
  { img: `${BASE}key-biscayne-3.jpg`, title: 'חלל פתוח' },
  { img: `${BASE}key-biscayne-4.jpg`, title: 'מבואה' },
  { img: `${BASE}key-biscayne-5.jpg`, title: 'חצר' },
  { img: `${BASE}key-biscayne-6.jpg`, title: 'כניסה' },
  { img: `${BASE}key-biscayne-7.jpg`, title: 'גינה' },
]

const TESTIMONIALS = [
  { quote: 'הנכס נמכר תוך שבועיים. הקונים אמרו שהסיור הוא מה שגרם להם להגיע לראות.', name: 'דנה לוי', role: 'מתווכת נדל"ן' },
  { quote: 'פתאום הליד-ים שהגיעו היו הרבה יותר רציניים — כבר ראו את הבית לפני שהתקשרו.', name: 'אבי כהן', role: 'בעל דירה להשכרה' },
  { quote: 'איכות מטורפת ושירות מהיר. הטמעתי את הסיור באתר תוך דקה עם הקוד שקיבלתי.', name: 'מיכל ברק', role: 'יזמית בוטיק' },
]

const FAQ_ITEMS: FaqItem[] = [
  { q: 'כמה זמן לוקח?', a: 'הצילום בנכס אורך כשעה-שעתיים, והסיור המוכן נשלח תוך עד 48 שעות.' },
  { q: 'מה אני מקבל בסוף?', a: 'לינק ייחודי לסיור + קוד הטמעה (iframe) שמשבצים באתר או במודעה.' },
  { q: 'זה עובד בנייד?', a: 'כן — הסיור רץ חלק בכל דפדפן ובכל מכשיר, בלי שום אפליקציה.' },
  { q: 'מה צריך להכין לפני הצילום?', a: 'שהנכס יהיה מסודר ומואר. את כל הציוד אני מביא.' },
  { q: 'אפשר לעדכן את הסיור בהמשך?', a: 'בהחלט — אפשר להוסיף, להחליף או לסדר מחדש חדרים בכל שלב.' },
]

export default function HomeV2() {
  return (
    <main className="flex-1">
      {/* ============== HERO — full-bleed אימרסיבי ============== */}
      <section className="relative flex h-[100svh] min-h-[620px] flex-col justify-end overflow-hidden">
        {/* תמונת showreel + Ken-Burns */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMG}
            alt="סיור וירטואלי 360° בנכס"
            className="animate-kenburns h-full w-full object-cover"
          />
          {/* שכבות כהות לקריאוּת */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent" />
        </div>

        {/* תוכן */}
        <div className="relative mx-auto w-full max-w-[1240px] px-6 pb-20 pt-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-caption font-semibold text-white backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-accent" />
              צילום וסיורים 360° לנדל&quot;ן
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-[14ch] font-display text-mega font-black leading-[0.9] tracking-tight text-white">
              הנכס שלך,
              <br />
              חי 24/7.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-lg text-body-lg text-white/80">
              סיור וירטואלי שגורם לקונים להרגיש שהם כבר בפנים — לפני שהם בכלל
              הרימו טלפון. אני מצלם, בונה, ושולח לך לינק מוכן.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/tour/test"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-body font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
              >
                כניסה לסיור חי
                <ArrowLeft size={18} strokeWidth={2.4} />
              </Link>
              <a
                href="#contact"
                className="rounded-full border border-white/35 bg-white/5 px-7 py-3.5 text-body font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15"
              >
                לקבלת הצעת מחיר
              </a>
            </div>
          </Reveal>
        </div>

        {/* רמז גלילה */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
          <ChevronDown className="animate-bounce text-white/60" size={24} />
        </div>
      </section>

      {/* ============== מספרים / הישגים ============== */}
      <section id="service" className="border-b border-border">
        <div className="mx-auto grid max-w-[1240px] gap-y-10 px-6 py-14 sm:grid-cols-3 sm:divide-x sm:divide-border sm:rtl:divide-x-reverse">
          {[
            { v: <CountUp to={2.7} decimals={1} suffix="×" />, l: 'יותר זמן צפייה מול תמונות רגילות' },
            { v: <><span>24</span><span className="text-accent">/</span><span>7</span></>, l: 'הנכס פתוח לביקור, מכל מכשיר' },
            { v: <CountUp to={48} suffix=" שעות" />, l: 'מהצילום ועד סיור מוכן' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group sm:px-8 sm:first:pr-0">
                <p className="font-display text-heading-sm font-black tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-heading">
                  {s.v}
                </p>
                <p className="mt-2 text-body text-muted-foreground">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============== איך זה עובד ============== */}
      <section className="mx-auto max-w-[1240px] px-6 py-24">
        <Reveal>
          <h2 className="font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg">
            איך זה עובד
          </h2>
          <p className="mt-4 max-w-md text-body-lg text-muted-foreground">
            תהליך מלא מקצה לקצה — אתה רק פותח את הדלת.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-4 bg-surface p-7 transition-colors hover:bg-accent/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <step.icon size={20} />
                  </span>
                  <span className="font-display text-heading-sm font-black text-border-strong/15 transition-colors group-hover:text-accent/30">
                    {step.n}
                  </span>
                </div>
                <div>
                  <h3 className="text-subheading font-bold text-foreground">{step.t}</h3>
                  <p className="mt-2 text-body text-muted-foreground">{step.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============== גלריית סיורים ============== */}
      <section className="mx-auto max-w-[1240px] px-6 pb-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg">
              סיורים נבחרים
            </h2>
            <Link
              href="/tour/test"
              className="inline-flex items-center gap-1.5 text-body font-semibold text-accent transition-opacity hover:opacity-80"
            >
              לכל הסיורים
              <ArrowLeft size={17} strokeWidth={2.4} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g, i) => (
            <Reveal key={g.img} delay={(i % 3) * 0.08}>
              <Link
                href="/tour/test"
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.img}
                  alt={g.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                  <span className="text-body font-semibold text-white">{g.title}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-caption font-medium text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    360°
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============== המלצות / social proof ============== */}
      <section className="border-y border-border bg-subtle">
        <div className="mx-auto max-w-[1240px] px-6 py-24">
          <Reveal>
            <h2 className="font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg">
              לקוחות מספרים
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-7 shadow-soft">
                  <Quote className="text-accent" size={28} />
                  <blockquote className="mt-4 flex-1 text-body-lg leading-relaxed text-foreground">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4">
                    <span className="block font-semibold text-foreground">{t.name}</span>
                    <span className="text-caption text-muted-foreground">{t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== מחירים ============== */}
      <section id="pricing" className="mx-auto max-w-[1240px] px-6 py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <Reveal>
            <h2 className="font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg">
              תמחור הוגן,
              <br />
              לפי הנכס.
            </h2>
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
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" className="mx-auto max-w-[1240px] px-6 pb-24">
        <Reveal>
          <h2 className="mb-10 font-display text-heading font-black leading-[0.95] tracking-tight text-foreground sm:text-heading-lg">
            שאלות נפוצות
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Faq items={FAQ_ITEMS} />
        </Reveal>
      </section>

      {/* ============== צור קשר ============== */}
      <section id="contact" className="mx-auto max-w-[1240px] px-6 pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
            <div className="grid md:grid-cols-2">
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
              <div className="p-8 sm:p-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============== FOOTER ============== */}
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
