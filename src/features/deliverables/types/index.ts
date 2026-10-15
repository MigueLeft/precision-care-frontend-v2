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

export interface DeliverableHeader {
  patient: { name: string; mrn: string | null; birthDate: string | null }
  specialist: { name: string; specialty: string | null }
  // Fecha de la consulta (ISO).
  date: string
}

export interface LabOrderLine {
  name: string
  loincCode: string | null
  instructions: string | null
}

export interface PrescriptionLine {
  name: string
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
    dose: string
    frequency: string
    duration: string
    route?: string
    instructions?: string
  }[]
}

export type ConsultationDeliverableType = 'prescription' | 'lab_order'

export interface PrintDeliverableResult {
  deliverable: Deliverable
  // false = reimpresión sin cambios (no se registró de nuevo).
  created: boolean
}
