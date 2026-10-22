import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import {
  fetchDeliverableTemplates,
  updateDeliverableTemplate,
} from '../services/deliverable-templates.service'
import { deliverablesKeys } from './deliverables.keys'

export function useDeliverableTemplates() {
  return useQuery({
    queryKey: deliverablesKeys.templates,
    queryFn: fetchDeliverableTemplates,
  })
}

export function useUpdateDeliverableTemplate(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (baseStructure: Record<string, string>) =>
      updateDeliverableTemplate(id, baseStructure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliverablesKeys.templates })
      toast.success('Plantilla actualizada')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al guardar la plantilla'))
    },
  })
}
