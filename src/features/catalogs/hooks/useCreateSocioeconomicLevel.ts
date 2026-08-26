import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createSocioeconomicLevel } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateSocioeconomicLevel(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSocioeconomicLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.socioeconomicLevels })
      toast.success('Nivel socioeconómico creado correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el nivel socioeconómico'))
    },
  })
}
