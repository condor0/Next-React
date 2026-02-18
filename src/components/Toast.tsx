import { Button } from './Button'
import type { ToastTone } from '../state/uiStore'
import { useUiStore } from '../state/uiStore'

const toneStyles: Record<ToastTone, string> = {
  neutral: 'border-slate-200 bg-white text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
}

export function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts)
  const removeToast = useUiStore((state) => state.removeToast)

  return (
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
  )
}

