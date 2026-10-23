import { z } from 'zod'
import { optionalTextSchema } from '@/utils/text-validation'

export const paraclinicalValueTypeOptions = ['numeric', 'text', 'boolean'] as const

const NUMERIC_VALUE_REGEX = /^-?\d+(\.\d+)?$/

const referenceValueSchema = optionalTextSchema(30)

// Igual que el DTO del backend: admite % y + (ej. "Hb glicosilada (%)").
const PARACLINICAL_NAME_REGEX = /^[\p{L}\p{N}\s.,()/%+-]+$/u
// LOINC: de 1 a 7 dígitos, guion y dígito verificador (ej. 2093-3).
const LOINC_REGEX = /^(\d{1,7}-\d)?$/

const paraclinicalFormBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del paraclínico es requerido.')
    .max(150, 'El nombre no debe superar los 150 caracteres.')
    .regex(PARACLINICAL_NAME_REGEX, 'El nombre contiene caracteres no permitidos.'),
  loincCode: z.string().trim().regex(LOINC_REGEX, 'El código LOINC debe tener el formato 2093-3.'),
  description: optionalTextSchema(300),
  categoryId: z
    .number({ error: 'Selecciona una categoría.' })
    .int()
    .positive('Selecciona una categoría.'),
  defaultUnit: optionalTextSchema(30),
  valueType: z.enum(paraclinicalValueTypeOptions),
  referenceMin: referenceValueSchema,
  referenceMax: referenceValueSchema,
  showByDefault: z.boolean(),
})

export type ParaclinicalFormValues = z.infer<typeof paraclinicalFormBaseSchema>

/**
 * `existingNames` son los nombres de los demás paraclínicos ya guardados (excluyendo el que se
 * está editando, si aplica) — permite bloquear duplicados en el formulario antes de enviarlo,
 * además de la validación autoritativa que hace el backend.
 */
export function createParaclinicalFormSchema(existingNames: string[] = []) {
  const normalizedExistingNames = new Set(
    existingNames.map((name) => name.trim().toLowerCase()),
  )

  // Las referencias mínima/máxima se guardan en columnas numéricas del backend,
  // por lo que solo tienen sentido cuando el paraclínico es de tipo "numeric".
  return paraclinicalFormBaseSchema.superRefine((data, ctx) => {
    if (normalizedExistingNames.has(data.name.trim().toLowerCase())) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Ya existe un paraclínico con ese nombre.',
      })
    }

    const referenceMin = data.referenceMin?.trim() ?? ''
    const referenceMax = data.referenceMax?.trim() ?? ''

    if (data.valueType !== 'numeric') {
      if (referenceMin) {
        ctx.addIssue({
          code: 'custom',
          path: ['referenceMin'],
          message: 'Las referencias numéricas solo aplican cuando el tipo de valor es numérico.',
        })
      }
      if (referenceMax) {
        ctx.addIssue({
          code: 'custom',
          path: ['referenceMax'],
          message: 'Las referencias numéricas solo aplican cuando el tipo de valor es numérico.',
        })
      }
      return
    }

    if (referenceMin && !NUMERIC_VALUE_REGEX.test(referenceMin)) {
      ctx.addIssue({ code: 'custom', path: ['referenceMin'], message: 'Ingresa un valor numérico válido.' })
    }
    if (referenceMax && !NUMERIC_VALUE_REGEX.test(referenceMax)) {
      ctx.addIssue({ code: 'custom', path: ['referenceMax'], message: 'Ingresa un valor numérico válido.' })
    }
    if (
      referenceMin &&
      referenceMax &&
      NUMERIC_VALUE_REGEX.test(referenceMin) &&
      NUMERIC_VALUE_REGEX.test(referenceMax) &&
      Number(referenceMin) >= Number(referenceMax)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['referenceMax'],
        message: 'La referencia máxima debe ser mayor que la referencia mínima.',
      })
    }
  })
}

export const paraclinicalFormDefaultValues: ParaclinicalFormValues = {
  name: '',
  loincCode: '',
  description: '',
  categoryId: 0,
  defaultUnit: '',
  valueType: 'numeric',
  referenceMin: '',
  referenceMax: '',
  showByDefault: false,
}
