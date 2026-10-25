import { buildNarrative, type NarrativeLine, type PhysicalExam } from '@/features/physical-exam'

export interface PhysicalExamChange {
  code: string
  label: string
  before: string | null
  after: string
}

// Sistemas cuya descripción cambió respecto al examen de la consulta anterior.
// Si la consulta actual aún no documenta un sistema, no se reporta.
export function physicalExamChanges(previous: PhysicalExam | null, current: PhysicalExam | null): PhysicalExamChange[] {
  if (!current) return []
  const before = previous ? buildNarrative(previous).lines : []
  return buildNarrative(current).lines.flatMap((line: NarrativeLine) => {
    const prior = before.find((b) => b.code === line.code)?.text ?? null
    return prior === line.text ? [] : [{ code: line.code, label: line.label, before: prior, after: line.text }]
  })
}
