import type { CreateAntecedentPayload } from '@/features/antecedents'

interface SurgicalEventDraft {
  patientId: number
  type: 'surgery' | 'hospitalization'
  name: string
  catalogId?: number
  /** Fecha del evento, AAAA-MM-DD (opcional). */
  date: string
  complications: string
}

// Payload de una cirugía u hospitalización capturada en la consulta. Las
// complicaciones van en el detalle del evento (no en las notas del antecedente).
export function buildSurgicalAntecedentPayload(draft: SurgicalEventDraft): CreateAntecedentPayload {
  const complications = draft.complications.trim() || undefined
  const date = draft.date || undefined

  return {
    patientId: draft.patientId,
    type: draft.type,
    name: draft.name,
    eventDate: date,
    surgeryDetail:
      draft.type === 'surgery'
        ? { procedure: draft.name, procedureCatalogId: draft.catalogId, complications }
        : undefined,
    hospitalizationDetail:
      draft.type === 'hospitalization'
        ? {
            reason: draft.name,
            reasonCatalogId: draft.catalogId,
            admissionDate: date,
            complications,
          }
        : undefined,
  }
}
