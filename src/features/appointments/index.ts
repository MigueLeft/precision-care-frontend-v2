export { appointmentsKeys } from './hooks/appointments.keys'
export {
  fetchAppointments,
  fetchAppointmentsByPatient,
  fetchAppointment,
} from './services/appointments.service'
export { useAppointmentsByPatient } from './hooks/useAppointmentsByPatient'
export { useAppointments, useAppointment } from './hooks/useAppointments'
export {
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
  useStartConsultation,
  useSendReminder,
} from './hooks/useAppointmentMutations'
export { AppointmentsPage } from './components/AppointmentsPage'
export {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_TYPE_LABELS,
  getUpcomingAppointments,
  getPrimarySpecialist,
  getPrimarySpecialistName,
  getDurationMinutes,
  isCancelled,
} from './utils/appointment-helpers'
export type {
  Appointment,
  AppointmentModality,
  AppointmentType,
  AppointmentStatus,
  AppointmentRole,
  AppointmentSpecialist,
  AppointmentReminder,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from './types'
