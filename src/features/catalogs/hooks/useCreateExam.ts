import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createExam } from '../services/exams.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { ExamCatalog } from '../types'

interface UseCreateExamOptions {
  onSuccess?: (exam: ExamCatalog) => void
}

export function useCreateExam(options?: UseCreateExamOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExam,
    onSuccess: (exam) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.exams })
      toast.success(`Examen ${exam.name} creado correctamente`)
      options?.onSuccess?.(exam)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el examen'))
    },
  })
}
