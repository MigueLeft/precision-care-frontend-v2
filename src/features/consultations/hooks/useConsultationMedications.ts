import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchConsultationMedications,
  fetchConsultationMedicationHistory,
  addConsultationMedication,
  captureConsultationMedication,
} from '../services/consultations.service'
import { consultationsKeys } from './consultations.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { patientMedicationsKeys } from '@/features/patient-medications'
import type { AddMedicationInput, CaptureMedicationInput } from '../types'

export function useConsultationMedications(id: number) {
  return useQuery({
    queryKey: consultationsKeys.medications(id),
    queryFn: () => fetchConsultationMedications(id),
  })
}

export function useConsultationMedicationHistory(id: number) {
  return useQuery({
    queryKey: consultationsKeys.medicationHistory(id),
    queryFn: () => fetchConsultationMedicationHistory(id),
  })
}

function useInvalidateMedications(id: number) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: consultationsKeys.medications(id) })
    queryClient.invalidateQueries({ queryKey: consultationsKeys.medicationHistory(id) })
    queryClient.invalidateQueries({ queryKey: patientMedicationsKeys.all })
  }
}

export function useAddConsultationMedication(id: number, options?: { onSuccess?: () => void }) {
  const invalidate = useInvalidateMedications(id)
  return useMutation({
    mutationFn: (input: AddMedicationInput) => addConsultationMedication(id, input),
    onSuccess: () => {
      invalidate()
      toast.success('Medicamento añadido al expediente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al añadir el medicamento'))
    },
  })
}

export function useCaptureConsultationMedication(id: number) {
  const invalidate = useInvalidateMedications(id)
  return useMutation({
    mutationFn: ({
      medicationId,
      input,
    }: {
      medicationId: number
      input: CaptureMedicationInput
    }) => captureConsultationMedication(id, medicationId, input),
    onSuccess: (medication) => {
      invalidate()
      toast.success(
        medication.status === 'previous'
          ? 'Tratamiento finalizado'
          : 'Registro guardado',
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar el registro'))
    },
  })
}
