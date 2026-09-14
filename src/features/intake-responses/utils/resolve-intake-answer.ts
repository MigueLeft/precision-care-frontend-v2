import type { IntakeResponseDetailQuestion } from '../types'

// Resuelve el texto a mostrar para la respuesta de una pregunta del detalle
// de un ingresable. Para 'multiple_choice' con varias opciones seleccionadas,
// concatena los textos de las opciones resueltas por id; en el resto de los
// casos usa el texto ya resuelto por el backend.
export function resolveIntakeAnswerText(
  question: IntakeResponseDetailQuestion,
): string | null {
  const { answer, options, type } = question
  if (!answer) return null

  if (type === 'multiple_choice' && answer.selectedOptionIds.length > 0 && options) {
    const labels = answer.selectedOptionIds
      .map((optionId) => options.find((option) => option.id === optionId)?.text)
      .filter((text): text is string => Boolean(text))
    if (labels.length > 0) return labels.join(', ')
  }

  return answer.text
}
