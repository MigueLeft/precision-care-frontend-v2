import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createAntecedent } from '../services/antecedents.service'
import { antecedentsKeys } from './antecedents.keys'
import { useDraftConsultationId } from '@/hooks/draft-consultation'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Antecedent, CreateAntecedentPayload } from '../types'

interface Options {
  onSuccess?: (antecedent: Antecedent) => void
}

export function useCreateAntecedent(patientId: number, options?: Options) {
  const queryClient = useQueryClient()
  // Dentro de una consulta en curso el cambio queda como borrador.
  const consultationId = useDraftConsultationId()

  return useMutation({
    mutationFn: (payload: CreateAntecedentPayload) =>
      createAntecedent({ ...payload, consultationId }),
    onSuccess: (antecedent) => {
      queryClient.invalidateQueries({
        queryKey: antecedentsKeys.ofPatient(patientId),
      })
      toast.success('Antecedente agregado correctamente')
      options?.onSuccess?.(antecedent)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al agregar el antecedente'))
    },
  })
}
