import * as Sentry from '@sentry/react'
import { router } from '@/router'

const dsn = import.meta.env.VITE_SENTRY_DSN

// Inicializa Sentry solo si hay DSN configurado (en local se puede omitir).
export function initSentry() {
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Datos clínicos: no enviar usuario, cookies, headers ni cuerpos de request.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
    },
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      // El replay enmascara todo el texto e inputs para no filtrar datos de pacientes.
      Sentry.replayIntegration({ maskAllText: true, maskAllInputs: true, blockAllMedia: true }),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    // Propaga el trace al backend para correlacionar errores front ↔ API.
    tracePropagationTargets: import.meta.env.VITE_API_URL ? [import.meta.env.VITE_API_URL] : [],
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}

// Handlers de React 19 para reportar errores capturados y no capturados.
export const sentryRootOptions = {
  onUncaughtError: Sentry.reactErrorHandler(),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}
