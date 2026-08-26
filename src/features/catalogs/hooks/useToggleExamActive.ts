import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleExamActive } from '../services/exams.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useToggleExamActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleExamActive,
    onSuccess: (exam) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.exams })
      toast.success(exam.active ? `${exam.name} marcado como activo` : `${exam.name} marcado como inactivo`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al cambiar el estado del examen'))
    },
  })
}
