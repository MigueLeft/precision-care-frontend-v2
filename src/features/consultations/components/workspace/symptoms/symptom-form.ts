import type { CatalogPick } from '@/components/ui/CatalogPicker'
import type { AddSymptomInput, ConsultationSymptom, SymptomDiseaseInput, SymptomStatus } from '../../../types'

// Diagnóstico asociado mientras se captura (del catálogo o escrito a mano).
export interface LinkedDiagnosis {
  diseaseCatalogId?: number
  name: string
  code: string | null
  status: SymptomStatus
}

export interface SymptomFormValues {
  pick: CatalogPick | null
  severityId: number | null
  // Fecha parcial: 'YYYY', 'YYYY-MM' o 'YYYY-MM-DD'.
  onsetDate: string
  status: SymptomStatus
  notes: string
  diseases: LinkedDiagnosis[]
}

export const EMPTY_SYMPTOM_FORM: SymptomFormValues = {
  pick: null,
  severityId: null,
  onsetDate: '',
  status: 'active',
  notes: '',
  diseases: [],
}

// Valores de un síntoma ya registrado para editarlo.
export function symptomToForm(symptom: ConsultationSymptom): SymptomFormValues {
  return {
    pick: { name: symptom.name ?? '', catalogId: symptom.symptomCatalogId },
    severityId: symptom.symptomSeverityId,
    onsetDate: symptom.onsetDate ?? '',
    status: symptom.status,
    notes: symptom.notes ?? '',
    diseases: symptom.diseases.map((link) => ({
      diseaseCatalogId: link.diseaseCatalogId,
      name: link.name ?? '—',
      code: link.code,
      status: link.status,
    })),
  }
}

// Los escritos a mano viajan solo con el nombre (el backend los da de alta).
export function toDiseaseInputs(links: LinkedDiagnosis[]): SymptomDiseaseInput[] {
  return links.map((link) =>
    link.diseaseCatalogId
      ? { diseaseCatalogId: link.diseaseCatalogId, status: link.status }
      : { name: link.name, status: link.status },
  )
}

export function toAddSymptomInput(values: SymptomFormValues): AddSymptomInput {
  const pick = values.pick as CatalogPick
  return {
    symptomCatalogId: pick.catalogId,
    name: pick.catalogId ? undefined : pick.name.trim(),
    symptomSeverityId: values.severityId ?? undefined,
    status: values.status,
    onsetDate: values.onsetDate || undefined,
    notes: values.notes.trim() || undefined,
    diseases: toDiseaseInputs(values.diseases),
  }
}
