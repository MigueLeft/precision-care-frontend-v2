import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchConsultationAllergies,
  fetchConsultationAllergyHistory,
  addConsultationAllergy,
  removeConsultationAllergy,
  setNoKnownAllergies,
} from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { patientsKeys } from '@/features/patients'
import type { AddAllergyInput } from '../types'

export function useConsultationAllergies(id: number) {
  return useQuery({
    queryKey: consultationsKeys.allergies(id),
    queryFn: () => fetchConsultationAllergies(id),
  })
}

export function useConsultationAllergyHistory(id: number) {
  return useQuery({
    queryKey: consultationsKeys.allergyHistory(id),
    queryFn: () => fetchConsultationAllergyHistory(id),
  })
}

function useInvalidateAllergies(id: number) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: consultationsKeys.allergies(id) })
    queryClient.invalidateQueries({ queryKey: consultationsKeys.allergyHistory(id) })
    queryClient.invalidateQueries({ queryKey: patientsKeys.all })
  }
}

export function useAddConsultationAllergy(id: number, options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateAllergies(id)
  return useMutation({
    mutationFn: (input: AddAllergyInput) => addConsultationAllergy(id, input),
    onSuccess: () => {
      invalidate()
      toast.success('Alergia registrada')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al registrar la alergia'))
    },
  })
}

export function useRemoveConsultationAllergy(id: number) {
  const invalidate = useInvalidateAllergies(id)
  return useMutation({
    mutationFn: (allergyId: number) => removeConsultationAllergy(id, allergyId),
    onSuccess: () => {
      invalidate()
      toast.success('Alergia eliminada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar la alergia'))
    },
  })
}

export function useSetNoKnownAllergies(id: number) {
  const invalidate = useInvalidateAllergies(id)
  return useMutation({
    mutationFn: (value: boolean) => setNoKnownAllergies(id, value),
    onSuccess: () => invalidate(),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar las alergias'))
    },
  })
}
