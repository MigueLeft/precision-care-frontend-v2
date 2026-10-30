// Apartados de la consulta en el índice lateral. Los "de captura" abren a la
// derecha el panel para buscar y registrar; el resto se muestra en el centro.
export type ClinicalSectionId =
  | 'antecedents'
  | 'symptoms'
  | 'treatment'
  | 'anthropometry'
  | 'physicalExam'
  | 'paraclinical'
  | 'diagnoses'
  | 'risk'
  | 'nutrition'
  | 'lifestyle'
  | 'problems'

// Vistas de apoyo (sin check de revisión) al final del índice.
export type ExtraSectionId = 'previous' | 'intakes' | 'deliverables'

export type WorkspaceSectionId = ClinicalSectionId | ExtraSectionId

export const CLINICAL_SECTIONS: { id: ClinicalSectionId; label: string }[] = [
  { id: 'antecedents', label: 'Antecedentes' },
  { id: 'symptoms', label: 'Síntomas' },
  { id: 'treatment', label: 'Tratamiento' },
  { id: 'anthropometry', label: 'Antropometría' },
  { id: 'physicalExam', label: 'Examen físico' },
  { id: 'paraclinical', label: 'Paraclínicos' },
  { id: 'diagnoses', label: 'Diagnósticos' },
  { id: 'risk', label: 'Riesgos' },
  { id: 'nutrition', label: 'Nutrición' },
  { id: 'lifestyle', label: 'Estilo de vida' },
  { id: 'problems', label: 'Problemas' },
]

export const EXTRA_SECTION_LABELS: Record<ExtraSectionId, string> = {
  previous: 'Consulta anterior',
  intakes: 'Ingresables',
  deliverables: 'Entregables',
}

export type CaptureSectionId = Extract<ClinicalSectionId, 'antecedents' | 'symptoms' | 'diagnoses'>

export function isCaptureSection(id: WorkspaceSectionId): id is CaptureSectionId {
  return id === 'antecedents' || id === 'symptoms' || id === 'diagnoses'
}

// El panel derecho aparece con un apartado de captura o un ingresable fijado.
export function hasRightPanel(section: WorkspaceSectionId, readOnly: boolean, pinnedIntakeId: number | null): boolean {
  return pinnedIntakeId !== null || (!readOnly && isCaptureSection(section))
}

export function sectionLabel(id: WorkspaceSectionId): string {
  return CLINICAL_SECTIONS.find((section) => section.id === id)?.label ?? EXTRA_SECTION_LABELS[id as ExtraSectionId]
}

export function sectionNumber(id: WorkspaceSectionId): number {
  return CLINICAL_SECTIONS.findIndex((section) => section.id === id) + 1
}
