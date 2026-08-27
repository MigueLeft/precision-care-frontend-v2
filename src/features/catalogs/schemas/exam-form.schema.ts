import { z } from 'zod'
import { alphanumericTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const examCategoryOptions = ['laboratory', 'imaging', 'cardiology', 'other'] as const
export const examValueTypeOptions = ['numeric', 'text', 'boolean'] as const

const NUMERIC_VALUE_REGEX = /^-?\d+(\.\d+)?$/

const referenceValueSchema = optionalTextSchema(30)

const examFormBaseSchema = z.object({
  name: alphanumericTextSchema('El nombre del examen', 150),
  category: z.enum(examCategoryOptions, { error: 'Selecciona una categoría.' }),
  defaultUnit: optionalTextSchema(30),
  valueType: z.enum(examValueTypeOptions),
  referenceMin: referenceValueSchema,
  referenceMax: referenceValueSchema,
})

export type ExamFormValues = z.infer<typeof examFormBaseSchema>

/**
 * `existingNames` son los nombres de los demás exámenes ya guardados (excluyendo el que se
 * está editando, si aplica) — permite bloquear duplicados en el formulario antes de enviarlo,
 * además de la validación autoritativa que hace el backend.
 */
export function createExamFormSchema(existingNames: string[] = []) {
  const normalizedExistingNames = new Set(existingNames.map((name) => name.trim().toLowerCase()))

  // Las referencias mínima/máxima se guardan en columnas numéricas del backend,
  // por lo que solo tienen sentido cuando el examen es de tipo "numeric".
  return examFormBaseSchema.superRefine((data, ctx) => {
    if (normalizedExistingNames.has(data.name.trim().toLowerCase())) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Ya existe un examen con ese nombre.',
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

export const examFormDefaultValues: ExamFormValues = {
  name: '',
  category: 'laboratory',
  defaultUnit: '',
  valueType: 'numeric',
  referenceMin: '',
  referenceMax: '',
}
