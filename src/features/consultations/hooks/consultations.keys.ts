export const consultationsKeys = {
  all: ['consultations'] as const,
  byPatient: (patientId: number) =>
    [...consultationsKeys.all, 'patient', patientId] as const,
  byAppointment: (appointmentId: number) =>
    [...consultationsKeys.all, 'appointment', appointmentId] as const,
  detail: (id: number) => [...consultationsKeys.all, 'detail', id] as const,
  diagnoses: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'diagnoses'] as const,
  symptoms: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'symptoms'] as const,
  symptomHistory: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'symptom-history'] as const,
}
