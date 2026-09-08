export const antecedentsKeys = {
  all: ['antecedents'] as const,
  byPatient: (patientId: number) =>
    [...antecedentsKeys.all, 'patient', patientId] as const,
}
