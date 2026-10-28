import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import {
  createStudyOrder,
  deleteStudyOrder,
  fetchConsultationStudyOrders,
  fetchStudyOrder,
  printStudyOrder,
  updateStudyOrder,
} from '../services/study-orders.service'
import { deliverablesKeys } from './deliverables.keys'
import type { CreateStudyOrderPayload } from '../types'

// Órdenes de estudio de una consulta (borradores hasta finalizarla).
export function useConsultationStudyOrders(consultationId: number) {
  return useQuery({
    queryKey: deliverablesKeys.studyOrders(consultationId),
    queryFn: () => fetchConsultationStudyOrders(consultationId),
  })
}

export function useStudyOrder(id: number | null) {
  return useQuery({
    queryKey: deliverablesKeys.studyOrder(id ?? 0),
    queryFn: () => fetchStudyOrder(id as number),
    enabled: id !== null,
  })
}

// Crea la orden (sin id) o la reemplaza (con id).
export function useSaveStudyOrder(id: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateStudyOrderPayload) =>
      id === null ? createStudyOrder(payload) : updateStudyOrder(id, payload),
    onSuccess: () => {
      // También refresca el catálogo si se agregó un centro de referencia nuevo.
      queryClient.invalidateQueries({ queryKey: deliverablesKeys.all })
      queryClient.invalidateQueries({ queryKey: ['catalogs', 'referral-providers'] })
      toast.success('Orden de estudio guardada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la orden de estudio'))
    },
  })
}

export function useDeleteStudyOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteStudyOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliverablesKeys.all })
      toast.success('Orden de estudio eliminada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la orden de estudio'))
    },
  })
}

// Registra la impresión (solo la primera o si el contenido cambió).
export function usePrintStudyOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: printStudyOrder,
    onSuccess: ({ created }) => {
      queryClient.invalidateQueries({ queryKey: deliverablesKeys.all })
      if (created) toast.success('Orden de estudio guardada en el expediente')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo generar la orden de estudio'))
    },
  })
}
