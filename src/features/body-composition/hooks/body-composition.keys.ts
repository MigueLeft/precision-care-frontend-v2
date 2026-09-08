export const bodyCompositionKeys = {
  all: ['body-compositions'] as const,
  byPatient: (patientId: number) =>
    [...bodyCompositionKeys.all, 'patient', patientId] as const,
}
