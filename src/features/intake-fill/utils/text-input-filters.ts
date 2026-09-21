import type { IntakeQuestionDisplayVariant } from '@/features/intake-responses'

// Caracteres no permitidos por variante: letras (con acentos), espacios,
// guiones y apóstrofes para nombres/países/ciudades; dígitos y símbolos de
// teléfono para `phone`.
const DISALLOWED: Partial<Record<IntakeQuestionDisplayVariant, RegExp>> = {
  letters_only: /[^\p{L}\s'-]/gu,
  phone: /[^\d+\s()-]/g,
}

// Elimina lo que el campo no admite (también al pegar texto).
export function sanitizeTextInput(
  value: string,
  variant: IntakeQuestionDisplayVariant | null,
): string {
  const disallowed = variant ? DISALLOWED[variant] : undefined
  return disallowed ? value.replace(disallowed, '') : value
}
