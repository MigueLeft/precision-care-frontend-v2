// Estado editable de una línea de la receta en el diálogo.
export interface PrescriptionLineState {
  medicationId: number
  name: string
  selected: boolean
  dose: string
  frequency: string
  duration: string
  route: string
  instructions: string
}

const REQUIRED = ['dose', 'frequency', 'duration'] as const

export function isLineComplete(line: PrescriptionLineState) {
  return REQUIRED.every((key) => line[key].trim() !== '')
}
