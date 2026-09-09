import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchPhysicalExamsByPatient,
  fetchPhysicalExamByConsultation,
  createPhysicalExam,
  updatePhysicalExam,
} from '../services/physical-exam.service'
import { physicalExamKeys } from './physical-exam.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { PhysicalExamMeasurements, SavePhysicalExamInput } from '../types'

export function usePhysicalExamsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: physicalExamKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchPhysicalExamsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}

export function usePhysicalExamByConsultation(consultationId: number) {
  return useQuery({
    queryKey: physicalExamKeys.byConsultation(consultationId),
    queryFn: () => fetchPhysicalExamByConsultation(consultationId),
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: physicalExamKeys.all })
}

export function useSavePhysicalExam(existingId: number | undefined) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (input: SavePhysicalExamInput) =>
      existingId
        ? updatePhysicalExam(existingId, input.measurements)
        : createPhysicalExam(input),
    onSuccess: () => {
      invalidate()
      toast.success('Examen físico guardado')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar el examen físico'))
    },
  })
}

export function useUpdatePhysicalExam(id: number, options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (measurements: PhysicalExamMeasurements) => updatePhysicalExam(id, measurements),
    onSuccess: () => {
      invalidate()
      toast.success('Examen físico actualizado')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el examen físico'))
    },
  })
}
