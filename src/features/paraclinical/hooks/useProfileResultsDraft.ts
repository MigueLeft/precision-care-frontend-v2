import type { ParaclinicalCatalog } from '@/features/catalogs'
import { todayIsoDate } from '@/utils/format-date'
import { buildStudyValue, resultDateIso } from '../utils/single-study-result'
import type { CreateParaclinicalResultInput } from '../types'
import { useEntryBlocks } from './useEntryBlocks'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

export interface StudyEntry {
  result: string
  unit: string
}

// Captura de varios resultados a la vez: perfiles, categorías de laboratorio y
// estudios sueltos despliegan sus bloques (useEntryBlocks). Un estudio que
// aparece en dos bloques comparte valor.
export function useProfileResultsDraft(patientId: number) {
  const entryBlocks = useEntryBlocks()
  const { blocks } = entryBlocks
  const [entries, setEntries] = useConsultationDraftState<Record<number, StudyEntry>>(`labResults:${patientId}.entries`, {})
  const [date, setDate] = useConsultationDraftState(`labResults:${patientId}.date`, todayIsoDate())

  function entryOf(study: ParaclinicalCatalog): StudyEntry {
    return entries[study.id] ?? { result: '', unit: study.defaultUnit ?? '' }
  }

  function setEntry(study: ParaclinicalCatalog, patch: Partial<StudyEntry>) {
    setEntries((prev) => ({ ...prev, [study.id]: { ...entryOf(study), ...patch } }))
  }

  // Estudios únicos (en orden) con resultado capturado.
  function filledStudies(): ParaclinicalCatalog[] {
    const seen = new Set<number>()
    return blocks
      .flatMap((block) => block.studies)
      .filter((study) => {
        if (seen.has(study.id) || !entryOf(study).result.trim()) return false
        seen.add(study.id)
        return true
      })
  }

  function buildInput(): CreateParaclinicalResultInput | null {
    const studies = filledStudies()
    if (studies.length === 0) return null
    return {
      patientId,
      resultDate: resultDateIso(date),
      values: studies.map((study) => {
        const entry = entryOf(study)
        return buildStudyValue(study, entry.result, entry.unit)
      }),
    }
  }

  function reset() {
    entryBlocks.reset()
    setEntries({})
  }

  return {
    ...entryBlocks,
    entryOf,
    setEntry,
    date,
    setDate,
    filledCount: filledStudies().length,
    buildInput,
    reset,
  }
}
