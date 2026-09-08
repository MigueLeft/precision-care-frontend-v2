export type AppointmentModality = 'in_person' | 'telemedicine'

export type AppointmentType =
  | 'first_consultation'
  | 'with_specialist'
  | 'follow_up'

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled_by_patient'
  | 'cancelled_by_clinic'
  | 'no_show'

export type AppointmentRole = 'primary' | 'companion'

export type ReminderChannel = 'email' | 'whatsapp'

export interface AppointmentSpecialist {
  specialistId: number
  role: AppointmentRole
  fullName: string | null
}

export interface AppointmentReminder {
  id: number
  appointmentId: number
  channel: ReminderChannel
  recipient: string
  content: string | null
  sentAt: string
}

export interface Appointment {
  id: number
  patientId: number
  startAtUtc: string
  endAtUtc: string
  originTimezone: string
  modality: AppointmentModality
  type: AppointmentType | null
  telemedicineLink: string | null
  location: string | null
  status: AppointmentStatus
  reason: string | null
  // Adjuntado por el backend.
  specialists: AppointmentSpecialist[]
  patientName: string | null
  reminders?: AppointmentReminder[]
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentPayload {
  patientId: number
  startAtUtc: string
  endAtUtc: string
  originTimezone: string
  modality: AppointmentModality
  type?: AppointmentType
  telemedicineLink?: string
  location?: string
  reason?: string
  specialistIds: { specialistId: number; role: AppointmentRole }[]
}

export type UpdateAppointmentPayload = Partial<
  Omit<CreateAppointmentPayload, 'patientId'>
> & {
  status?: AppointmentStatus
}
