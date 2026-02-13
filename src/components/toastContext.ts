import { createContext, useContext } from 'react'

type ToastContextValue = {
  addToast: (toast: ToastOptions) => void
}

export type ToastTone = 'neutral' | 'success' | 'error'

export type ToastItem = {
  id: string
  title: string
  description?: string
  tone?: ToastTone
}

export type ToastOptions = Omit<ToastItem, 'id'> & { duration?: number }

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
