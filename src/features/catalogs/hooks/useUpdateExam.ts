import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateExam } from '../services/exams.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { ExamCatalog, UpdateExamPayload } from '../types'

interface UseUpdateExamOptions {
  onSuccess?: (exam: ExamCatalog) => void
}

export function useUpdateExam(id: number | undefined, options?: UseUpdateExamOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateExamPayload) => updateExam(id as number, payload),
    onSuccess: (exam) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.exams })
      toast.success('Examen actualizado correctamente')
      options?.onSuccess?.(exam)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el examen'))
    },
  })
}
