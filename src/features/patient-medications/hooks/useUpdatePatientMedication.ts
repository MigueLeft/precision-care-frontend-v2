import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePatientMedication } from '../services/patient-medications.service'
import { patientMedicationsKeys } from './patient-medications.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { PatientMedication, UpdatePatientMedicationPayload } from '../types'

interface Options {
  onSuccess?: (medication: PatientMedication) => void
  successMessage?: string
}

export function useUpdatePatientMedication(patientId: number, options?: Options) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdatePatientMedicationPayload
    }) => updatePatientMedication(id, payload),
    onSuccess: (medication) => {
      queryClient.invalidateQueries({
        queryKey: patientMedicationsKeys.byPatient(patientId),
      })
      toast.success(options?.successMessage ?? 'Medicamento actualizado')
      options?.onSuccess?.(medication)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el medicamento'))
    },
  })
}
