import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPatientMedication } from '../services/patient-medications.service'
import { patientMedicationsKeys } from './patient-medications.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { CreatePatientMedicationPayload, PatientMedication } from '../types'

interface Options {
  onSuccess?: (medication: PatientMedication) => void
}

export function useCreatePatientMedication(patientId: number, options?: Options) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePatientMedicationPayload) =>
      createPatientMedication(payload),
    onSuccess: (medication) => {
      queryClient.invalidateQueries({
        queryKey: patientMedicationsKeys.byPatient(patientId),
      })
      toast.success('Medicamento agregado correctamente')
      options?.onSuccess?.(medication)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar el medicamento'))
    },
  })
}
