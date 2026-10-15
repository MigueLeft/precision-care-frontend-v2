import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import {
  fetchConsultationDrafts,
  printConsultationDeliverable,
  saveLabOrder,
  savePrescription,
} from '../services/deliverables.service'
import { deliverablesKeys } from './deliverables.keys'
import type {
  ConsultationDeliverableType,
  SaveLabOrderPayload,
  SavePrescriptionPayload,
} from '../types'

// Orden de laboratorio y receta en borrador de la consulta.
export function useConsultationDrafts(consultationId: number) {
  return useQuery({
    queryKey: deliverablesKeys.drafts(consultationId),
    queryFn: () => fetchConsultationDrafts(consultationId),
  })
}

export function useSaveLabOrder(consultationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SaveLabOrderPayload) => saveLabOrder(consultationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliverablesKeys.drafts(consultationId) })
      toast.success('Orden de laboratorio guardada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la orden de laboratorio'))
    },
  })
}

export function useSavePrescription(consultationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SavePrescriptionPayload) => savePrescription(consultationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliverablesKeys.drafts(consultationId) })
      toast.success('Receta guardada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la receta'))
    },
  })
}

// Registra la impresión (solo la primera o si el contenido cambió).
export function usePrintConsultationDeliverable(consultationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (type: ConsultationDeliverableType) =>
      printConsultationDeliverable(consultationId, type),
    onSuccess: ({ created }) => {
      queryClient.invalidateQueries({ queryKey: deliverablesKeys.all })
      toast.success(
        created
          ? 'Entregable registrado en el expediente (reemplaza la versión anterior de esta consulta)'
          : 'Reimpresión sin cambios: no se registró de nuevo',
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo generar el entregable'))
    },
  })
}
