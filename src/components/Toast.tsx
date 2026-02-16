import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from './Button'
import type { ToastItem, ToastOptions, ToastTone } from './toastContext'
import { ToastContext } from './toastContext'

const toneStyles: Record<ToastTone, string> = {
  neutral: 'border-slate-200 bg-white text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    ({ duration = 4000, tone = 'neutral', ...toast }: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      setToasts((prev) => [...prev, { id, tone, ...toast }])
      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration)
      }
    },
    [removeToast],
  )

  const value = useMemo(() => ({ addToast }), [addToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed right-6 top-6 z-50 flex w-[min(360px,90vw)] flex-col gap-3"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-soft ${
              toneStyles[toast.tone ?? 'neutral']
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs opacity-80">{toast.description}</p>
                ) : null}
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeToast(toast.id)}>
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

