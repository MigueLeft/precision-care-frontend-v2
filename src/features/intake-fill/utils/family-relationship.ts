import type { IntakeResponseDetailQuestionOption } from '@/features/intake-responses'

// `value` de la opción "Ninguna de las anteriores": es excluyente y no pide parentesco.
const NONE_OPTION_VALUE = 'none'
const SEPARATOR = ', '

export function isNoneOption(option: IntakeResponseDetailQuestionOption): boolean {
  return option.value === NONE_OPTION_VALUE
}

// Los parentescos de una condición se guardan separados por coma en el texto
// adjunto a la opción ("Padre, Madre").
export function splitRelationships(text: string | undefined): string[] {
  return (text ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function joinRelationships(relationships: string[]): string {
  return relationships.join(SEPARATOR)
}
