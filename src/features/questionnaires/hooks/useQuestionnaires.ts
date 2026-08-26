import { useQuery } from '@tanstack/react-query'
import { fetchQuestionnaires } from '../services/questionnaires.service'
import { questionnairesKeys } from './questionnaires.keys'

export function useQuestionnaires() {
  return useQuery({
    queryKey: questionnairesKeys.lists(),
    queryFn: fetchQuestionnaires,
  })
}
