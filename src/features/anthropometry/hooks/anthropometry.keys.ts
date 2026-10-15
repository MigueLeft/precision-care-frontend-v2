export const anthropometryKeys = {
  all: ['anthropometry'] as const,
  byPatient: (patientId: number) => [...anthropometryKeys.all, 'patient', patientId] as const,
  byConsultation: (consultationId: number) =>
    [...anthropometryKeys.all, 'consultation', consultationId] as const,
}
