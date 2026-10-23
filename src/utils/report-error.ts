import * as Sentry from '@sentry/react'
import { isAxiosError } from 'axios'

// Mensaje que ve el paciente en las páginas públicas (ingresable y NutriBot):
// nunca se le muestra el detalle técnico del error.
export const FRIENDLY_ERROR_MESSAGE =
  'Tuvimos un inconveniente y ya estamos trabajando en ello. Por favor, intenta de nuevo en unos minutos.'

// Envía el error a Sentry (sin efecto si Sentry no está configurado) con la
// zona donde ocurrió, para poder encontrarlo y corregirlo.
export function reportError(error: unknown, area: string, extra?: Record<string, unknown>) {
  Sentry.captureException(error, { tags: { area }, extra })
}

// Enlace inexistente o expirado: es un caso esperado, no un fallo del sistema.
export function isNotFoundError(error: unknown) {
  return isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 410)
}

// Reporta el error salvo que sea un enlace inválido; lo vuelve a lanzar para
// que la UI muestre su estado de error.
export function reportAndRethrow(area: string) {
  return (error: unknown): never => {
    if (!isNotFoundError(error)) reportError(error, area)
    throw error
  }
}
