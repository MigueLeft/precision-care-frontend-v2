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

// La indicación es lo que se imprime en la hoja del paciente.
export function isLineComplete(line: PrescriptionLineState) {
  return line.instructions.trim() !== ''
}

// Indicación sugerida cuando el medicamento no tiene una predefinida.
export function composeIndication(line: Pick<PrescriptionLineState, 'dose' | 'frequency' | 'duration'>) {
  return [line.dose, line.frequency, line.duration ? `por ${line.duration}` : '']
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ')
}
