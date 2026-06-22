'use client'

// ============================================================
// components/ui/Notifications.tsx — מערכת התראות מעוצבת לכל האתר.
// מספקת useNotify() עם:
//   toast(message, kind)  — הודעת "טוסט" צפה (success / error / info)
//   confirm(options)      — דיאלוג אישור מעוצב שמחזיר Promise<boolean>
// מחליף את alert()/confirm() של הדפדפן.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

interface NotifyCtx {
  toast: (message: string, kind?: ToastKind) => void
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const Ctx = createContext<NotifyCtx | null>(null)

export function useNotify(): NotifyCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotify חייב לרוץ בתוך NotificationProvider')
  return ctx
}

const TOAST_ICON = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
} as const

const TOAST_ACCENT = {
  success: 'text-emerald-500',
  error: 'text-signal',
  info: 'text-carbon',
} as const

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)
  const idRef = useRef(0)

  const toast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve })
    })
  }, [])

  const closeConfirm = useCallback(
    (result: boolean) => {
      setConfirmState((cur) => {
        cur?.resolve(result)
        return null
      })
    },
    [],
  )

  // Escape / Enter on the confirm dialog
  useEffect(() => {
    if (!confirmState) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeConfirm(false)
      if (e.key === 'Enter') closeConfirm(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmState, closeConfirm])

  return (
    <Ctx.Provider value={{ toast, confirm }}>
      {children}

      {/* ---- מחסנית טוסטים (למטה במרכז) ---- */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2.5 px-4">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = TOAST_ICON[t.kind]
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-slate/15 bg-paper px-5 py-3.5 shadow-card"
                dir="rtl"
              >
                <Icon size={20} className={`shrink-0 ${TOAST_ACCENT[t.kind]}`} />
                <span className="text-caption font-medium text-carbon">{t.message}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ---- דיאלוג אישור ---- */}
      <AnimatePresence>
        {confirmState && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* רקע כהה */}
            <div
              className="absolute inset-0 bg-carbon/55 backdrop-blur-[2px]"
              onClick={() => closeConfirm(false)}
            />

            {/* הכרטיס */}
            <motion.div
              role="alertdialog"
              dir="rtl"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-sm rounded-3xl border border-slate/15 bg-paper p-7 shadow-card"
            >
              <div className="flex items-start gap-3.5">
                {confirmState.danger && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
                    <AlertTriangle size={20} />
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-display text-subheading font-bold leading-tight text-carbon">
                    {confirmState.title}
                  </h3>
                  {confirmState.message && (
                    <p className="mt-1.5 text-caption leading-relaxed text-graphite">
                      {confirmState.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => closeConfirm(false)}
                  className="-mt-1 mr-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:bg-mist hover:text-carbon"
                  aria-label="סגור"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 flex gap-2.5">
                <button
                  onClick={() => closeConfirm(true)}
                  className={`flex-1 rounded-full px-5 py-2.5 text-caption font-semibold text-paper transition-opacity hover:opacity-85 ${
                    confirmState.danger ? 'bg-signal' : 'bg-carbon'
                  }`}
                >
                  {confirmState.confirmLabel ?? 'אישור'}
                </button>
                <button
                  onClick={() => closeConfirm(false)}
                  className="flex-1 rounded-full border border-slate/25 px-5 py-2.5 text-caption font-semibold text-carbon transition-colors hover:bg-mist"
                >
                  {confirmState.cancelLabel ?? 'ביטול'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  )
}
