export type DeliverableType =
  | 'prescription'
  | 'lab_order'
  | 'nutritional_report'
  | 'other'

export interface Deliverable {
  id: number
  templateId: number
  patientId: number
  specialistId: number
  consultationId: number | null
  data: Record<string, unknown>
  pdfS3Key: string | null
  generatedAt: string
  signed: boolean
  createdAt: string
  updatedAt: string
  // Adjuntado por el backend (join a deliverable_template).
  type: DeliverableType | null
  templateName: string | null
}

// ─── Entregables de consulta (orden de laboratorio y receta) ───────────────

// Textos editables de la plantilla (página Entregables). Las fotos anteriores
// al 2026-10-16 no los traen: se usan valores por defecto.
export interface PrescriptionTemplateSettings {
  recipeTitle?: string
  indicationsTitle?: string
}

export interface LabOrderTemplateSettings {
  headerTitle?: string
  headerSubtitle?: string
  headerLines?: string
  documentTitle?: string
}

export interface DeliverableHeader {
  patient: {
    name: string
    mrn: string | null
    birthDate: string | null
    identityDocument?: string | null
    age?: number | null
  }
  // Membrete del médico (titles: una línea por título).
  specialist: {
    name: string
    specialty: string | null
    titles?: string | null
    registrations?: string | null
    address?: string | null
    phone?: string | null
  }
  // Fecha de la consulta (ISO).
  date: string
  template?: PrescriptionTemplateSettings & LabOrderTemplateSettings
}

export interface LabOrderLine {
  name: string
  loincCode: string | null
  instructions: string | null
}

export interface PrescriptionLine {
  name: string
  // Presentación y concentración ("Tableta 25 mg").
  presentation?: string
  dose: string
  frequency: string
  duration: string
  route: string | null
  instructions: string | null
}

// "Foto" guardada en deliverable.data al imprimir o al finalizar la consulta.
export type LabOrderData = DeliverableHeader & {
  // Nombre del perfil elegido o escrito a mano (registros anteriores no lo tienen).
  title?: string | null
  indications: string | null
  items: LabOrderLine[]
}
export type PrescriptionData = DeliverableHeader & { items: PrescriptionLine[] }

export interface LabOrderDraft {
  title: string | null
  indications: string | null
  items: { paraclinicalCatalogId: number; instructions: string | null; name: string; loincCode: string | null }[]
}

export interface PrescriptionDraftItem {
  medicationId: number
  dose: string
  frequency: string
  duration: string
  route: string | null
  instructions: string | null
  brandName: string
  genericName: string
  concentration: string | null
  presentationName: string | null
}

export interface ConsultationDrafts {
  labOrder: LabOrderDraft
  prescription: { items: PrescriptionDraftItem[] }
}

export interface SaveLabOrderPayload {
  items: { paraclinicalCatalogId: number; instructions?: string }[]
  title?: string
  indications?: string
}

export interface SavePrescriptionPayload {
  items: {
    medicationId: number
    dose?: string
    frequency?: string
    duration?: string
    route?: string
    // Indicación que se imprime en la hoja del paciente.
    instructions: string
  }[]
}

// Plantilla de entregable; base_structure guarda los textos editables.
export interface DeliverableTemplate {
  id: number
  type: DeliverableType
  name: string
  description: string | null
  baseStructure: Record<string, unknown>
  active: boolean
}

export type ConsultationDeliverableType = 'prescription' | 'lab_order'

export interface PrintDeliverableResult {
  deliverable: Deliverable
  // false = reimpresión sin cambios (no se registró de nuevo).
  created: boolean
}
