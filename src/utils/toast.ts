import { useToastStore, type ToastSeverity } from '@/store/toast.store'

// Título por defecto de cada tipo de notificación.
const DEFAULT_TITLES: Record<ToastSeverity, string> = {
  success: 'Operación exitosa',
  error: 'Error',
  warning: 'Advertencia',
  info: 'Información',
}

function notify(severity: ToastSeverity) {
  return (message: string, title: string = DEFAULT_TITLES[severity]) =>
    useToastStore.getState().show({ severity, message, title })
}

// API de notificaciones usable fuera de componentes (hooks de mutación, utils).
// Las muestra el <ToastViewport /> montado en la ruta raíz.
export const toast = {
  success: notify('success'),
  error: notify('error'),
  warning: notify('warning'),
  info: notify('info'),
}
