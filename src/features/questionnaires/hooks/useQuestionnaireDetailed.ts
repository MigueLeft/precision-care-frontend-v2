import { useQuery } from '@tanstack/react-query'
import { fetchQuestionnaireDetailed } from '../services/questionnaires.service'
import { questionnairesKeys } from './questionnaires.keys'

export function useQuestionnaireDetailed(id: number) {
  return useQuery({
    queryKey: questionnairesKeys.detail(id),
    queryFn: () => fetchQuestionnaireDetailed(id),
  })
}
