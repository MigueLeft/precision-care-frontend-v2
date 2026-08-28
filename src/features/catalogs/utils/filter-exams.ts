import type { ExamCatalog } from '../types'

interface ExamFilters {
  q?: string
  categoryId?: number
  onlyActive?: boolean
}

export function filterExams(exams: ExamCatalog[], filters: ExamFilters): ExamCatalog[] {
  return exams.filter((exam) => {
    if (filters.onlyActive && !exam.active) return false
    if (filters.categoryId && exam.categoryId !== filters.categoryId) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      if (!exam.name.toLowerCase().includes(needle)) return false
    }
    return true
  })
}
