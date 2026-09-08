export const questionnaireResponsesKeys = {
  all: ['questionnaire-responses'] as const,
  byPatient: (patientId: number) =>
    [...questionnaireResponsesKeys.all, 'patient', patientId] as const,
}
