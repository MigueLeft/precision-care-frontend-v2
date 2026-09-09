export type MedicationStatus = 'current' | 'previous'
export type MedicationAdherence = 'good' | 'partial' | 'poor'
export type MedicationRamStatus = 'none' | 'suspected' | 'confirmed'

export interface PatientMedication {
  id: number
  patientId: number
  medicationId: number
  consultationId: number | null
  status: MedicationStatus
  dose: string | null
  frequency: string | null
  duration: string | null
  quantity: string | null
  presentation: string | null
  startAt: string | null
  endAt: string | null
  discontinuationReason: string | null
  adherence: MedicationAdherence | null
  adherenceNotes: string | null
  ramStatus: MedicationRamStatus | null
  ramNotes: string | null
  createdAt: string
  updatedAt: string
  // Adjuntado por el backend (join a medication_catalog / presentation / especialista).
  brandName: string | null
  genericName: string | null
  concentration: string | null
  presentationName: string | null
  prescriberName: string | null
  // Todas las versiones de este medicamento, más recientes primero.
  versions: PatientMedication[]
}

export interface CreatePatientMedicationPayload {
  patientId: number
  medicationId: number
  status: MedicationStatus
  dose?: string
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
