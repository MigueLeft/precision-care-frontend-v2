export const paraclinicalKeys = {
  all: ['paraclinical'] as const,
  // Prefijo de todas las vistas de resultados del paciente (expediente y consultas).
  resultsOfPatient: (patientId: number) =>
    [...paraclinicalKeys.all, 'results', 'patient', patientId] as const,
  resultsByPatient: (patientId: number, consultationId?: number) =>
    [...paraclinicalKeys.resultsOfPatient(patientId), consultationId ?? 'record'] as const,
  ordersByPatient: (patientId: number) =>
    [...paraclinicalKeys.all, 'orders', 'patient', patientId] as const,
}
