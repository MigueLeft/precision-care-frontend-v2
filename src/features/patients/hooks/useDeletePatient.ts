import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deletePatient } from '../services/patients.service'
import { patientsKeys } from './patients.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface UseDeletePatientOptions {
  onSuccess?: () => void
}

export function useDeletePatient(options?: UseDeletePatientOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() })
      toast.success('Paciente eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el paciente'))
    },
  })
}
