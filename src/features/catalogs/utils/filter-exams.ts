import type { ExamCatalog, ExamCategory } from '../types'

interface ExamFilters {
  q?: string
  category?: ExamCategory
  onlyActive?: boolean
}

export function filterExams(exams: ExamCatalog[], filters: ExamFilters): ExamCatalog[] {
  return exams.filter((exam) => {
    if (filters.onlyActive && !exam.active) return false
    if (filters.category && exam.category !== filters.category) return false
    if (filters.q) {
      const needle = filters.q.trim().toLowerCase()
      if (!exam.name.toLowerCase().includes(needle)) return false
    }
    return true
  })
}
