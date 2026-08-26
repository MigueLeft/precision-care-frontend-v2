import type { Questionnaire } from '../types'

interface QuestionnaireFilters {
  q?: string
  type?: string
}

export function filterQuestionnaires(
  questionnaires: Questionnaire[],
  filters: QuestionnaireFilters,
): Questionnaire[] {
  return questionnaires.filter((questionnaire) => {
    if (filters.type && questionnaire.type !== filters.type) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      const haystack = `${questionnaire.name} ${questionnaire.description ?? ''}`.toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}
