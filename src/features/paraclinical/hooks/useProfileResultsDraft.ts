import { useState } from 'react'
import { useLabProfiles, useParaclinicals } from '@/features/catalogs'
import type { ParaclinicalCatalog } from '@/features/catalogs'
import { todayIsoDate } from '@/utils/format-date'
import { buildStudyValue, resultDateIso } from '../utils/single-study-result'
import type { CreateParaclinicalResultInput } from '../types'

export interface StudyEntry {
  result: string
  unit: string
}

// Bloque de captura: un perfil elegido o los estudios sueltos del catálogo.
export interface ProfileBlock {
  key: string
  title: string
  studies: ParaclinicalCatalog[]
}

// Captura de varios resultados a la vez: perfiles de laboratorio (cada uno
// despliega sus estudios) y estudios sueltos elegidos del catálogo. Un estudio
// que aparece en dos bloques comparte valor.
export function useProfileResultsDraft(patientId: number) {
  const { data: profiles = [] } = useLabProfiles()
  const { data: catalog = [] } = useParaclinicals()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [studyIds, setStudyIds] = useState<number[]>([])
  const [entries, setEntries] = useState<Record<number, StudyEntry>>({})
  const [date, setDate] = useState(todayIsoDate())

  const studyById = new Map(catalog.map((study) => [study.id, study]))
  const profileBlocks: ProfileBlock[] = selectedIds.flatMap((id) => {
    const profile = profiles.find((item) => item.id === id)
    if (!profile) return []
    const studies = profile.items.flatMap((item) => studyById.get(item.id) ?? [])
    return [{ key: `profile-${profile.id}`, title: profile.name, studies }]
  })
  const looseStudies = studyIds.flatMap((id) => studyById.get(id) ?? [])
  const blocks: ProfileBlock[] =
    looseStudies.length > 0
      ? [...profileBlocks, { key: 'studies', title: 'Estudios elegidos', studies: looseStudies }]
      : profileBlocks

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
    setSelectedIds([])
    setStudyIds([])
    setEntries({})
  }

  return {
    profiles: profiles.filter((profile) => profile.active),
    selectedIds,
    setSelectedIds,
    studyIds,
    setStudyIds,
    blocks,
    entryOf,
    setEntry,
    date,
    setDate,
    filledCount: filledStudies().length,
    buildInput,
    reset,
  }
}
