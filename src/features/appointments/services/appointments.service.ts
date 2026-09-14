import { api } from '@/utils/api'
import type { Consultation } from '@/features/consultations'
import type {
  Appointment,
  AppointmentReminder,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../types'

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<{ appointments: Appointment[] }>('/appointments')
  return data.appointments
}

export async function fetchAppointmentsByPatient(
  patientId: number,
): Promise<Appointment[]> {
  const { data } = await api.get<{ appointments: Appointment[] }>(
    `/appointments/patient/${patientId}`,
  )
  return data.appointments
}

export async function fetchAppointment(id: number): Promise<Appointment> {
  const { data } = await api.get<{ appointment: Appointment }>(
    `/appointments/${id}`,
  )
  return data.appointment
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const { data } = await api.post<{ appointment: Appointment }>(
    '/appointments',
    payload,
  )
  return data.appointment
}

export async function updateAppointment(
  id: number,
  payload: UpdateAppointmentPayload,
): Promise<Appointment> {
  const { data } = await api.patch<{ appointment: Appointment }>(
    `/appointments/${id}`,
    payload,
  )
  return data.appointment
}

export async function startConsultationForAppointment(
  id: number,
): Promise<{ appointment: Appointment; consultation: Consultation }> {
  const { data } = await api.post<{
    appointment: Appointment
    consultation: Consultation
  }>(`/appointments/${id}/start-consultation`)
  return data
}

export async function sendAppointmentReminder(
  id: number,
): Promise<{ reminder: AppointmentReminder; sent: boolean }> {
  const { data } = await api.post<{
    reminder: AppointmentReminder
    sent: boolean
  }>(`/appointments/${id}/reminders`, { channel: 'email' })
  return data
}

export async function sendIntakeAssignment(
  appointmentId: number,
  intakeVersionId: number,
): Promise<{ response: unknown; sent: boolean }> {
  const { data } = await api.post<{
    response: unknown
    sent: boolean
  }>(`/appointments/${appointmentId}/intake-assignments`, { intakeVersionId })
  return data
}
