export const antecedentsKeys = {
  all: ['antecedents'] as const,
  // Prefijo de todas las vistas del paciente (expediente y consultas).
  ofPatient: (patientId: number) =>
    [...antecedentsKeys.all, 'patient', patientId] as const,
  byPatient: (patientId: number, consultationId?: number) =>
    [...antecedentsKeys.ofPatient(patientId), consultationId ?? 'record'] as const,
}
