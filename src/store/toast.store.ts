import { create } from 'zustand'

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  severity: ToastSeverity
  message: string
  title?: string
  // false = cerrándose (la transición de salida sigue en curso).
  open: boolean
}

interface ToastState {
  items: ToastItem[]
  show: (toast: Omit<ToastItem, 'id' | 'open'>) => void
  close: (id: number) => void
  remove: (id: number) => void
}

// Máximo de notificaciones visibles a la vez; las más antiguas se cierran.
const MAX_VISIBLE = 4

let nextId = 1

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  show: (toast) =>
    set((state) => {
      const items = [...state.items, { ...toast, id: nextId++, open: true }]
      const openItems = items.filter((item) => item.open)
      const overflow = new Set(
        openItems.slice(0, Math.max(0, openItems.length - MAX_VISIBLE)).map((item) => item.id),
      )
      return {
        items: items.map((item) => (overflow.has(item.id) ? { ...item, open: false } : item)),
      }
    }),
  close: (id) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, open: false } : item)),
    })),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}))
