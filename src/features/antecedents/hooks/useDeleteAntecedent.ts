import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteAntecedent } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface Options {
  onSuccess?: () => void
}

export function useDeleteAntecedent(patientId: number, options?: Options) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAntecedent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: antecedentsKeys.byPatient(patientId),
      })
      toast.success('Antecedente eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el antecedente'))
    },
  })
}
