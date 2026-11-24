import { medicationFormDefaultValues, type MedicationFormValues } from '../schemas/medication-form.schema'
import type { PatientMedication } from '../types'

export function medicationToForm(medication?: PatientMedication): MedicationFormValues {
  if (!medication) return medicationFormDefaultValues
  return {
    medicationId: medication.medicationId,
    dose: medication.dose ?? '',
    frequency: medication.frequency ?? '',
    frequencyNotes: medication.frequencyNotes ?? '',
    duration: medication.duration ?? '',
    quantity: medication.quantity ?? '',
    presentation: medication.presentation ?? '',
    startAt: medication.startAt ?? '',
  }
}

export function medicationSchedulePayload(values: MedicationFormValues) {
  return {
    dose: values.dose?.trim() ?? '',
    frequency: values.frequency?.trim() ?? '',
    frequencyNotes: values.frequencyNotes?.trim() ?? '',
    duration: values.duration?.trim() ?? '',
    quantity: values.quantity?.trim() ?? '',
    presentation: values.presentation?.trim() ?? '',
  }
}
