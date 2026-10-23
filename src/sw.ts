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
