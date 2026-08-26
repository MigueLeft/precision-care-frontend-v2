import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createPatient } from '../services/patients.service'
import { patientsKeys } from './patients.keys'
import { formatPatientName } from '../utils/patient-format'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Patient } from '../types'

interface UseCreatePatientOptions {
  onSuccess?: (patient: Patient) => void
}

export function useCreatePatient(options?: UseCreatePatientOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatient,
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() })
      toast.success(`Paciente ${formatPatientName(patient)} creado correctamente`)
      options?.onSuccess?.(patient)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el paciente'))
    },
  })
}
