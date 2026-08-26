import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { publishVersion } from '../services/questionnaires.service'
import { questionnairesKeys } from './questionnaires.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { QuestionnaireVersion } from '../types'

interface UsePublishVersionOptions {
  onSuccess?: (version: QuestionnaireVersion) => void
}

export function usePublishVersion(questionnaireId: number, options?: UsePublishVersionOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (versionId: number) => publishVersion(versionId),
    onSuccess: (version) => {
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.detail(questionnaireId) })
      queryClient.invalidateQueries({ queryKey: questionnairesKeys.lists() })
      toast.success(`Versión ${version.versionNumber} publicada correctamente`)
      options?.onSuccess?.(version)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al publicar la versión'))
    },
  })
}
