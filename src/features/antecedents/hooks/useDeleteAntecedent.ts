import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { deleteAntecedent } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'
import { useDraftConsultationId } from '@/hooks/draft-consultation'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface Options {
  onSuccess?: () => void
}

export function useDeleteAntecedent(patientId: number, options?: Options) {
  const queryClient = useQueryClient()
  // Dentro de una consulta en curso el cambio queda como borrador.
  const consultationId = useDraftConsultationId()

  return useMutation({
    mutationFn: (id: number) => deleteAntecedent(id, consultationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: antecedentsKeys.ofPatient(patientId),
      })
      toast.success('Antecedente eliminado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al eliminar el antecedente'))
    },
  })
}
