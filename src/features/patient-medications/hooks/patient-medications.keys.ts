export const patientMedicationsKeys = {
  all: ['patient-medications'] as const,
  byPatient: (patientId: number) =>
    [...patientMedicationsKeys.all, 'patient', patientId] as const,
}
