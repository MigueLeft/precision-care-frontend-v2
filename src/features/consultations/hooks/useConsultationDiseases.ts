import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchConsultationDiseases,
  fetchConsultationDiseaseHistory,
  addConsultationDisease,
  updateConsultationDisease,
  removeConsultationDisease,
} from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { AddDiseaseInput, UpdateDiseaseInput } from '../types'

export function useConsultationDiseases(id: number) {
  return useQuery({
    queryKey: consultationsKeys.diseases(id),
    queryFn: () => fetchConsultationDiseases(id),
  })
}

export function useConsultationDiseaseHistory(id: number) {
  return useQuery({
    queryKey: consultationsKeys.diseaseHistory(id),
    queryFn: () => fetchConsultationDiseaseHistory(id),
  })
}

function useInvalidateDiseases(id: number) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: consultationsKeys.diseases(id) })
    queryClient.invalidateQueries({ queryKey: consultationsKeys.diseaseHistory(id) })
  }
}

export function useAddConsultationDisease(id: number, options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateDiseases(id)
  return useMutation({
    mutationFn: (input: AddDiseaseInput) => addConsultationDisease(id, input),
    onSuccess: () => {
      invalidate()
      toast.success('Enfermedad registrada')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al registrar la enfermedad'))
    },
  })
}

export function useUpdateConsultationDisease(id: number) {
  const invalidate = useInvalidateDiseases(id)
  return useMutation({
    mutationFn: ({ diseaseId, input }: { diseaseId: number; input: UpdateDiseaseInput }) =>
      updateConsultationDisease(id, diseaseId, input),
    onSuccess: () => {
      invalidate()
      toast.success('Enfermedad actualizada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la enfermedad'))
    },
  })
}

export function useRemoveConsultationDisease(id: number) {
  const invalidate = useInvalidateDiseases(id)
  return useMutation({
    mutationFn: (diseaseId: number) => removeConsultationDisease(id, diseaseId),
    onSuccess: () => {
      invalidate()
      toast.success('Enfermedad eliminada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la enfermedad'))
    },
  })
}
