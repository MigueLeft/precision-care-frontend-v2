export const paraclinicalKeys = {
  all: ['paraclinical'] as const,
  resultsByPatient: (patientId: number) =>
    [...paraclinicalKeys.all, 'results', 'patient', patientId] as const,
  ordersByPatient: (patientId: number) =>
    [...paraclinicalKeys.all, 'orders', 'patient', patientId] as const,
}
