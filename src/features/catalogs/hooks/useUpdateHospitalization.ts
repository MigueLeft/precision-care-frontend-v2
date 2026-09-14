import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateHospitalization } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useUpdateHospitalization(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateHospitalization(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.hospitalizationReasons })
      toast.success('Motivo de hospitalización actualizado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el motivo de hospitalización'))
    },
  })
}
