export type MedicationStatus = 'current' | 'previous'

export interface PatientMedication {
  id: number
  patientId: number
  medicationId: number
  status: MedicationStatus
  frequency: string | null
  duration: string | null
  quantity: string | null
  presentation: string | null
  startAt: string | null
  endAt: string | null
  discontinuationReason: string | null
  createdAt: string
  updatedAt: string
  // Adjuntado por el backend (join a medication_catalog / presentation).
  brandName: string | null
  genericName: string | null
  concentration: string | null
  presentationName: string | null
}

export interface CreatePatientMedicationPayload {
  patientId: number
  medicationId: number
  status: MedicationStatus
  frequency?: string
  duration?: string
  quantity?: string
  presentation?: string
  startAt?: string
  endAt?: string
  discontinuationReason?: string
}

export type UpdatePatientMedicationPayload = Partial<
  Omit<CreatePatientMedicationPayload, 'patientId'>
>
