import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePatient } from '../services/patients.service'
import { patientsKeys } from './patients.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Patient } from '../types'
import type { UpdatePatientDto } from '../schemas/patient.schema'

interface UseUpdatePatientOptions {
  onSuccess?: (patient: Patient) => void
}

export function useUpdatePatient(id: number | undefined, options?: UseUpdatePatientOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePatientDto) => updatePatient(id as number, payload),
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() })
      if (id) queryClient.invalidateQueries({ queryKey: patientsKeys.detail(id) })
      toast.success('Paciente actualizado correctamente')
      options?.onSuccess?.(patient)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el paciente'))
    },
  })
}
