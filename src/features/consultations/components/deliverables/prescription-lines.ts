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
  // Indicación predefinida del catálogo; se restablece al volver a marcar la línea.
  defaultInstructions: string
}

// La indicación es lo que se imprime en la hoja del paciente.
export function isLineComplete(line: PrescriptionLineState) {
  return line.instructions.trim() !== ''
}

// Comodín de la indicación predefinida: se reemplaza por el nombre y la
// concentración del medicamento ("Tomar 1 tableta de {medicamento} ...").
const MEDICATION_TOKEN = /\{\s*medicamento\s*\}/gi

export function fillIndication(template: string, medicationName: string) {
  return template.replace(MEDICATION_TOKEN, medicationName)
}
