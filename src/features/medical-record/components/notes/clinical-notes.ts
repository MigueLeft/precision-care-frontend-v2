import type { Consultation } from '@/features/consultations'
import type { LegacySymptom, PatientLegacyHistory } from '@/features/patients'

// Entrada de la pestaña "Notas": texto libre y problemas de una consulta
// finalizada o de la historia del sistema anterior.
export interface ClinicalNoteEntry {
  key: string
  date: string | null
  source: 'consultation' | 'legacy'
  author: string | null
  reason?: string | null
  currentIllness: string | null
  evolution: string | null
  diagnosticPlan: string | null
  treatmentPlan: string | null
  problems: { actuales: string[]; previos: string[] } | null
  symptoms?: LegacySymptom[] | null
}

const hasContent = (entry: ClinicalNoteEntry) =>
  [entry.reason, entry.currentIllness, entry.evolution, entry.diagnosticPlan, entry.treatmentPlan].some((t) => t?.trim()) ||
  (entry.problems?.actuales.length ?? 0) + (entry.problems?.previos.length ?? 0) > 0 ||
  (entry.symptoms?.length ?? 0) > 0

// Consultas con texto y la historia anterior, de la más reciente a la más antigua.
export function buildClinicalNotes(
  consultations: Consultation[],
  legacy: PatientLegacyHistory | null | undefined,
): ClinicalNoteEntry[] {
  const entries: ClinicalNoteEntry[] = consultations.map((c) => ({
    key: `c-${c.id}`,
    date: c.startAt,
    source: 'consultation',
    author: c.specialistName ?? null,
    reason: c.consultationReason,
    currentIllness: c.currentIllness,
    evolution: c.evolution,
    diagnosticPlan: c.diagnosticPlan,
    treatmentPlan: c.treatmentPlan,
    problems: c.problems ? { actuales: c.problems.actuales ?? [], previos: c.problems.previos ?? [] } : null,
  }))
  if (legacy) {
    entries.push({
      key: `legacy-${legacy.id}`,
      date: legacy.recordedAt,
      source: 'legacy',
      author: null,
      currentIllness: legacy.currentIllness,
      evolution: legacy.evolution,
      diagnosticPlan: legacy.diagnosticPlan,
      treatmentPlan: legacy.treatmentPlan,
      problems: legacy.problems,
      symptoms: legacy.symptoms,
    })
  }
  return entries
    .filter(hasContent)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}
