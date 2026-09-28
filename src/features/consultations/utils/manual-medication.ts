// Valores del formulario de un medicamento que no está en el catálogo.
export interface ManualMedicationValue {
  name: string
  presentationId: number | ''
  concentration: string
}

export const EMPTY_MANUAL_MEDICATION: ManualMedicationValue = {
  name: '',
  presentationId: '',
  concentration: '',
}
