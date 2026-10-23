import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { updateParaclinical } from '../services/paraclinicals.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

interface ToggleDefaultInput {
  id: number
  showByDefault: boolean
}

// Marca si el estudio aparece al elegir su categoría en la captura de resultados.
export function useToggleParaclinicalDefault() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, showByDefault }: ToggleDefaultInput) =>
      updateParaclinical(id, { showByDefault }),
    onSuccess: (paraclinical) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.paraclinicals })
      toast.success(
        paraclinical.showByDefault
          ? `${paraclinical.name} aparecerá por defecto`
          : `${paraclinical.name} ya no aparecerá por defecto`,
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el paraclínico'))
    },
  })
}
