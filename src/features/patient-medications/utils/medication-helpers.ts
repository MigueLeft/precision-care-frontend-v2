import type { PatientMedication } from '../types'

// Nombre a mostrar sin concentración (columna "Medicamento").
export function getMedicationDisplayName(medication: PatientMedication): string {
  return medication.brandName ?? medication.genericName ?? 'Medicamento'
}

// Nombre completo con concentración (usos compactos: Resumen).
export function formatMedicationName(medication: PatientMedication): string {
  const base = getMedicationDisplayName(medication)
  return medication.concentration ? `${base} ${medication.concentration}` : base
}

export function getCurrentMedications(
  medications: PatientMedication[],
): PatientMedication[] {
  return medications.filter((m) => m.status === 'current')
}

export function getPreviousMedications(
  medications: PatientMedication[],
): PatientMedication[] {
  return medications.filter((m) => m.status === 'previous')
}
