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
