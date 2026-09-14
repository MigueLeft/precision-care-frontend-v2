export const intakeResponsesKeys = {
  all: ['intake-responses'] as const,
  byPatient: (patientId: number) =>
    [...intakeResponsesKeys.all, 'patient', patientId] as const,
}
