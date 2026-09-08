import { useQuery } from '@tanstack/react-query'
import { fetchQuestionnaireResponsesByPatient } from '../services/questionnaire-responses.service'
import { questionnaireResponsesKeys } from './questionnaire-responses.keys'

export function useQuestionnaireResponsesByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: questionnaireResponsesKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchQuestionnaireResponsesByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}
