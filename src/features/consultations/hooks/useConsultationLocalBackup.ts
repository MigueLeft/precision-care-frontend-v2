import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  clearConsultationDraft,
  flushConsultationDraft,
  flushDraftsOnPageHide,
  loadConsultationDraft,
} from '@/utils/consultation-draft-storage'
import { toast } from '@/utils/toast'
import { consultationsKeys } from './consultations.keys'
// Bandeja de salida en localStorage (desactivada: el respaldo vive en el backend).
// import { api } from '@/utils/api'
// import { replayOutbox } from '@/utils/consultation-outbox'

// Respaldo de lo capturado en la consulta en curso (consultation.draft_state):
// se carga antes de mostrar los apartados para que cada campo recupere lo que
// quedó escrito. Devuelve true cuando ya se puede mostrar la consulta.
export function useConsultationLocalBackup(consultationId: number, readOnly: boolean) {
  const draft = useQuery({
    queryKey: [...consultationsKeys.detail(consultationId), 'draft-state'],
    queryFn: async () => {
      await loadConsultationDraft(consultationId)
      return true
    },
    enabled: !readOnly,
    staleTime: Infinity,
    retry: 1,
  })

  // Al cerrar o recargar la pestaña se envía lo pendiente.
  useEffect(() => {
    if (readOnly) return
    window.addEventListener('pagehide', flushDraftsOnPageHide)
    return () => window.removeEventListener('pagehide', flushDraftsOnPageHide)
  }, [readOnly])

  useEffect(() => {
    if (draft.isError) {
      toast.warning('No se pudo recuperar el respaldo de la consulta; lo que escribas se seguirá respaldando.')
    }
  }, [draft.isError])

  // Sin respaldo que recuperar (solo lectura) o si falló la carga, se muestra igual.
  return readOnly || draft.isSuccess || draft.isError
}

// Antes de finalizar: lo pendiente del respaldo debe llegar al servidor.
export async function flushBeforeFinalize(consultationId: number) {
  const saved = await flushConsultationDraft(consultationId)
  if (!saved) {
    toast.error(
      'No se pudo guardar lo capturado en la consulta. Revisa tu conexión o inicia sesión de nuevo antes de finalizar.',
    )
  }
  return saved
}

export { clearConsultationDraft }

// ─────────────────────────────────────────────────────────────────────────────
// Versión anterior con localStorage (bandeja de salida): reenviaba al abrir la
// consulta lo que no había llegado al servidor. Desactivada.
// ─────────────────────────────────────────────────────────────────────────────
//
// const plural = (n: number) => (n === 1 ? 'cambio' : 'cambios')
//
// export function useConsultationLocalBackup(consultationId: number, readOnly: boolean) {
//   const queryClient = useQueryClient()
//   useEffect(() => {
//     purgeStaleConsultationDrafts()
//     if (readOnly) return
//     let cancelled = false
//     replayOutbox(api, consultationId).then(({ sent, pending }) => {
//       if (cancelled) return
//       if (sent > 0) {
//         queryClient.invalidateQueries()
//         toast.success(`Se recuperaron ${sent} ${plural(sent)} de la consulta guardados en este equipo`)
//       }
//       if (pending > 0) {
//         toast.warning(`${pending} ${plural(pending)} de la consulta siguen pendientes de enviar.`)
//       }
//     })
//     return () => {
//       cancelled = true
//     }
//   }, [consultationId, readOnly, queryClient])
// }
//
// export async function flushBeforeFinalize(consultationId: number) {
//   const { pending } = await replayOutbox(api, consultationId)
//   if (pending > 0) {
//     toast.error(`No se pudieron enviar ${pending} ${plural(pending)} guardados en este equipo.`)
//     return false
//   }
//   return true
// }
