import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export type ToastTone = 'neutral' | 'success' | 'error'

export type ToastItem = {
  id: string
  title: string
  description?: string
  tone?: ToastTone
}

export type ToastOptions = Omit<ToastItem, 'id'> & { duration?: number }

type ModalState = {
  isOpen: boolean
  title?: string
  content?: string
}

type UiState = {
  // Toast slice: transient notifications
  toasts: ToastItem[]
  addToast: (toast: ToastOptions) => void
  removeToast: (id: string) => void

  // Modal slice: lightweight overlay state
  modal: ModalState
  openModal: (modal: Omit<ModalState, 'isOpen'>) => void
  closeModal: () => void
}

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  modal: { isOpen: false },
  addToast: ({ duration = 4000, tone = 'neutral', ...toast }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    set((state) => ({
      toasts: [...state.toasts, { id, tone, ...toast }],
    }))

    if (duration > 0) {
      window.setTimeout(() => get().removeToast(id), duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  openModal: (modal) => set({ modal: { isOpen: true, ...modal } }),
  closeModal: () => set({ modal: { isOpen: false } }),
}))

export function useToast() {
  return useUiStore(useShallow((state) => ({ addToast: state.addToast })))
}
