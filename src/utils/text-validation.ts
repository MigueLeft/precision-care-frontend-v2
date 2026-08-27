import { z } from 'zod'

// Solo letras (con acentos/ñ), espacios, guiones y apóstrofes — sin números ni símbolos.
const LETTERS_ONLY_REGEX = /^[\p{L}\s'-]+$/u
// Letras, números, espacios y puntuación básica — sin símbolos especiales (!@#$%^&*, etc).
const ALPHANUMERIC_REGEX = /^[\p{L}\p{N}\s.,()/-]+$/u
const HAS_LETTER_REGEX = /\p{L}/u
const HAS_ALPHANUMERIC_REGEX = /[\p{L}\p{N}]/u

/** Campo de texto obligatorio compuesto solo por letras (nombres de personas, catálogos demográficos). */
export function lettersOnlySchema(label: string, maxLength = 100) {
  return z
    .string()
    .trim()
    .min(1, `${label} es requerido.`)
    .max(maxLength, `${label} no debe superar los ${maxLength} caracteres.`)
    .regex(LETTERS_ONLY_REGEX, `${label} no debe contener números ni caracteres especiales.`)
    .refine((value) => HAS_LETTER_REGEX.test(value), `${label} debe contener al menos una letra.`)
}

/** Campo de texto opcional compuesto solo por letras. */
export function optionalLettersOnlySchema(label: string, maxLength = 100) {
  return z
    .string()
    .trim()
    .max(maxLength, `${label} no debe superar los ${maxLength} caracteres.`)
    .regex(LETTERS_ONLY_REGEX, `${label} no debe contener números ni caracteres especiales.`)
    .optional()
    .or(z.literal(''))
}

/** Campo de texto obligatorio que permite letras y números, pero no caracteres especiales sueltos. */
export function alphanumericTextSchema(label: string, maxLength = 150) {
  return z
    .string()
    .trim()
    .min(1, `${label} es requerido.`)
    .max(maxLength, `${label} no debe superar los ${maxLength} caracteres.`)
    .regex(ALPHANUMERIC_REGEX, `${label} contiene caracteres no permitidos.`)
    .refine((value) => HAS_ALPHANUMERIC_REGEX.test(value), `${label} debe contener letras o números.`)
}

/** Campo de texto libre obligatorio (párrafos, preguntas) que solo exige no estar vacío ni ser solo espacios. */
export function requiredTextSchema(label: string, maxLength = 500) {
  return z
    .string()
    .trim()
    .min(1, `${label} es requerido.`)
    .max(maxLength, `${label} no debe superar los ${maxLength} caracteres.`)
}

/** Campo de texto libre opcional, con límite de caracteres. */
export function optionalTextSchema(maxLength = 500) {
  return z
    .string()
    .trim()
    .max(maxLength, `No debe superar los ${maxLength} caracteres.`)
    .optional()
    .or(z.literal(''))
}
