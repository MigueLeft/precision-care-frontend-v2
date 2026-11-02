import type { Consultation } from '@/features/consultations'

// Entrada de la pestaña "Notas": texto libre y problemas de una consulta
// finalizada. La historia del sistema anterior es su propia tarjeta (editable).
export interface ClinicalNoteEntry {
  key: string
  date: string | null
  author: string | null
  reason?: string | null
  currentIllness: string | null
  evolution: string | null
  diagnosticPlan: string | null
  treatmentPlan: string | null
  problems: { actuales: string[]; previos: string[] } | null
}

const hasContent = (entry: ClinicalNoteEntry) =>
  [entry.reason, entry.currentIllness, entry.evolution, entry.diagnosticPlan, entry.treatmentPlan].some((t) => t?.trim()) ||
  (entry.problems?.actuales.length ?? 0) + (entry.problems?.previos.length ?? 0) > 0

// Consultas con texto, de la más reciente a la más antigua.
export function buildClinicalNotes(consultations: Consultation[]): ClinicalNoteEntry[] {
  const entries: ClinicalNoteEntry[] = consultations.map((c) => ({
    key: `c-${c.id}`,
    date: c.startAt,
    author: c.specialistName ?? null,
    reason: c.consultationReason,
    currentIllness: c.currentIllness,
    evolution: c.evolution,
    diagnosticPlan: c.diagnosticPlan,
    treatmentPlan: c.treatmentPlan,
    problems: c.problems ? { actuales: c.problems.actuales ?? [], previos: c.problems.previos ?? [] } : null,
  }))
  return entries
    .filter(hasContent)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}
