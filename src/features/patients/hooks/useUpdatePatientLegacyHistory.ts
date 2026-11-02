import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { updatePatientLegacyHistory } from '../services/patients.service'
import type { UpdatePatientLegacyHistoryPayload } from '../services/patients.service'
import { patientsKeys } from './patients.keys'

// Autoguardado de los 4 campos de la historia del sistema anterior; sin toast
// de éxito (igual que los campos de la consulta), solo de error.
export function useUpdatePatientLegacyHistory(patientId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePatientLegacyHistoryPayload) =>
      updatePatientLegacyHistory(patientId, payload),
    onSuccess: (legacyHistory) => {
      queryClient.setQueryData(patientsKeys.legacyHistory(patientId), legacyHistory)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la historia del sistema anterior'))
    },
  })
}
