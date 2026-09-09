import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchPatientDiseases,
  addPatientDisease,
  updatePatientDisease,
} from '../services/patient-diseases.service'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { AddPatientDiseaseInput, UpdatePatientDiseaseInput } from '../types'

export const patientDiseasesKeys = {
  all: ['patient-diseases'] as const,
  byPatient: (patientId: number) =>
    [...patientDiseasesKeys.all, 'patient', patientId] as const,
}

export function usePatientDiseases(patientId: number | undefined) {
  return useQuery({
    queryKey: patientDiseasesKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchPatientDiseases(patientId as number),
    enabled: typeof patientId === 'number',
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: patientDiseasesKeys.all })
}

export function useAddPatientDisease(patientId: number, options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (input: AddPatientDiseaseInput) => addPatientDisease(patientId, input),
    onSuccess: () => {
      invalidate()
      toast.success('Enfermedad añadida al expediente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al añadir la enfermedad'))
    },
  })
}

export function useUpdatePatientDisease(patientId: number) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({
      diseaseId,
      input,
    }: {
      diseaseId: number
      input: UpdatePatientDiseaseInput
    }) => updatePatientDisease(patientId, diseaseId, input),
    onSuccess: () => {
      invalidate()
      toast.success('Estado actualizado')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar la enfermedad'))
    },
  })
}
