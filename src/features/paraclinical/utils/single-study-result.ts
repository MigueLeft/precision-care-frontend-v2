import type { ParaclinicalCatalog } from '@/features/catalogs'
import type {
  CreateParaclinicalResultInput,
  ParaclinicalResult,
  ParaclinicalResultValue,
} from '../types'

interface SingleStudyDraft {
  patientId: number
  study: ParaclinicalCatalog
  result: string
  unit: string
  /** Fecha del resultado, AAAA-MM-DD. */
  date: string
}

function computeStatus(value: number, min?: number, max?: number) {
  if (min !== undefined && value < min) return 'low' as const
  if (max !== undefined && value > max) return 'high' as const
  return 'normal' as const
}

// Resultado con un solo estudio (alta rápida): numérico si el texto es un
// número, en otro caso se guarda como texto.
export function buildSingleStudyInput(draft: SingleStudyDraft): CreateParaclinicalResultInput {
  const { study } = draft
  const result = draft.result.trim()
  const numericValue = Number(result.replace(',', '.'))
  const isNumeric = result !== '' && !Number.isNaN(numericValue)
  const referenceMin = study.referenceMin ? Number(study.referenceMin) : undefined
  const referenceMax = study.referenceMax ? Number(study.referenceMax) : undefined

  return {
    patientId: draft.patientId,
    resultDate: new Date(`${draft.date}T12:00:00.000Z`).toISOString(),
    values: [
      {
        paraclinicalCatalogId: study.id,
        numericValue: isNumeric ? numericValue : undefined,
        textValue: isNumeric ? undefined : result,
        unit: draft.unit.trim() || study.defaultUnit || undefined,
        referenceMin,
        referenceMax,
        status: isNumeric ? computeStatus(numericValue, referenceMin, referenceMax) : undefined,
      },
    ],
  }
}

export interface SameDayStudy {
  resultDate: string
  value: ParaclinicalResultValue
}

// Un estudio solo puede tener un resultado por día: devuelve el que el paciente
// ya tiene registrado en la fecha de `input` (si lo hay).
export function findSameDayStudy(
  results: ParaclinicalResult[],
  input: CreateParaclinicalResultInput,
): SameDayStudy | null {
  const day = input.resultDate.slice(0, 10)
  const studyIds = new Set(input.values.map((value) => value.paraclinicalCatalogId))
  for (const result of results) {
    if (result.resultDate.slice(0, 10) !== day) continue
    const value = result.values.find((item) => studyIds.has(item.paraclinicalCatalogId))
    if (value) return { resultDate: result.resultDate, value }
  }
  return null
}

export function formatStudyValue(value: ParaclinicalResultValue): string {
  const amount = value.numericValue ?? value.textValue ?? '—'
  return value.unit ? `${amount} ${value.unit}` : amount
}
