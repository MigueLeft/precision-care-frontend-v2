import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import {
  generateNutritionRecallReport,
  resendNutritionRecallReport,
  sendNutritionRecall,
  sendNutritionRecallEmail,
} from '../services/nutrition-recall.service'
import type { SendNutritionRecallDto } from '../types'
import { nutritionRecallKeys } from './nutrition-recall.keys'

// Crea el recordatorio y envía el link (si el paciente tiene correo).
export function useSendNutritionRecall() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SendNutritionRecallDto) => sendNutritionRecall(payload),
    onSuccess: (result, payload) => {
      void queryClient.invalidateQueries({
        queryKey: nutritionRecallKeys.byPatient(payload.patientId),
      })
      toast.success(
        result.sent
          ? 'Recordatorio de 24 Horas enviado por correo. También puedes copiar el enlace.'
          : 'Enlace generado (no se envió por correo). Cópialo y compártelo con el paciente.',
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo enviar el Recordatorio de 24 Horas.'))
    },
  })
}

// Reenvía por correo el enlace de un recordatorio pendiente.
export function useSendNutritionRecallEmail() {
  return useMutation({
    mutationFn: sendNutritionRecallEmail,
    onSuccess: ({ sent, email }) => {
      if (sent) toast.success(`Recordatorio enviado a ${email}`)
      else toast.warning('El correo no está configurado (SMTP); copia el enlace y compártelo.')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo enviar el recordatorio por correo.'))
    },
  })
}

// Refresca la lista del paciente y el detalle tras generar o reenviar.
function useRefreshRecall(patientId: number) {
  const queryClient = useQueryClient()
  return (id: number) => {
    void queryClient.invalidateQueries({ queryKey: nutritionRecallKeys.byPatient(patientId) })
    void queryClient.invalidateQueries({ queryKey: nutritionRecallKeys.detail(id) })
  }
}

// Genera el reporte desde la transcripción y envía el PDF.
export function useGenerateNutritionRecallReport(patientId: number) {
  const refresh = useRefreshRecall(patientId)
  return useMutation({
    mutationFn: generateNutritionRecallReport,
    onSuccess: (_result, id) => {
      refresh(id)
      toast.success('Reporte generado y enviado por correo.')
    },
    onError: (error, id) => {
      refresh(id)
      toast.error(getApiErrorMessage(error, 'No se pudo generar el reporte.'))
    },
  })
}

// Vuelve a enviar el PDF del reporte ya generado.
export function useResendNutritionRecallReport(patientId: number) {
  const refresh = useRefreshRecall(patientId)
  return useMutation({
    mutationFn: resendNutritionRecallReport,
    onSuccess: (_result, id) => {
      refresh(id)
      toast.success('Reporte reenviado por correo.')
    },
    onError: (error, id) => {
      refresh(id)
      toast.error(getApiErrorMessage(error, 'No se pudo reenviar el reporte.'))
    },
  })
}
