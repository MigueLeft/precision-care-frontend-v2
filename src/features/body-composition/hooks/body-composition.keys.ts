export const bodyCompositionKeys = {
  all: ['body-compositions'] as const,
  byPatient: (patientId: number) =>
    [...bodyCompositionKeys.all, 'patient', patientId] as const,
  byConsultation: (consultationId: number) =>
    [...bodyCompositionKeys.all, 'consultation', consultationId] as const,
}
