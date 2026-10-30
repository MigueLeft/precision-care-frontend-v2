import type { ConsultationMedication } from '../../../types'

// "Losartán 50 mg": marca (o genérico) con su concentración.
export function medicationName(medication: Pick<ConsultationMedication, 'brandName' | 'genericName' | 'concentration'>): string {
  const base = medication.brandName ?? medication.genericName ?? 'Medicamento'
  return medication.concentration ? `${base} ${medication.concentration}` : base
}
