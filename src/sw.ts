/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// Service worker de la PWA (vite-plugin-pwa, estrategia injectManifest).
declare let self: ServiceWorkerGlobalScope

// Nueva versión: se activa en cuanto se instala (sin esperar a cerrar pestañas).
void self.skipWaiting()
clientsClaim()

// Archivos del build en caché: la app abre rápido aunque la red sea lenta.
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Navegación de la SPA: cualquier ruta sirve index.html. Las llamadas al API
// (otro dominio) no pasan por aquí.
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

// Notificación push del backend (cita confirmada, cancelada, agenda del día).
self.addEventListener('push', (event) => {
  const payload = (event.data?.json() ?? { title: 'PrecisionCare', body: '' }) as PushPayload
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
      data: { url: payload.url ?? '/agenda' },
    }),
  )
})

// Al tocarla: enfoca la app si ya está abierta o la abre en la ruta indicada.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data as { url?: string } | undefined)?.url ?? '/agenda'
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const existing = windows.find((client) => new URL(client.url).origin === self.location.origin)
      if (existing) {
        await existing.focus()
        await existing.navigate(url)
        return
      }
      await self.clients.openWindow(url)
    })(),
  )
})
