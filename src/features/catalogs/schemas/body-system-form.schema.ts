import { z } from 'zod'
import { lettersOnlySchema, optionalTextSchema } from '@/utils/text-validation'

const bodySystemFormBaseSchema = z.object({
  name: lettersOnlySchema('El nombre', 100),
  shortCode: z
    .string()
    .trim()
    .min(1, 'El código corto es requerido.')
    .max(20, 'El código corto no debe superar los 20 caracteres.')
    .regex(/^[A-Za-z0-9-]+$/, 'El código corto solo puede contener letras, números y guiones.')
    .transform((value) => value.toUpperCase()),
  cie10Chapter: optionalTextSchema(20),
  description: optionalTextSchema(500),
})

export type BodySystemFormValues = z.infer<typeof bodySystemFormBaseSchema>

/**
 * `existingShortCodes` son los códigos cortos de los demás aparatos/sistemas ya guardados
 * (excluyendo el que se está editando) — bloquea duplicados sin distinguir mayúsculas/minúsculas.
 */
export function createBodySystemFormSchema(existingShortCodes: string[] = []) {
  const normalizedExisting = new Set(existingShortCodes.map((code) => code.trim().toUpperCase()))

  return bodySystemFormBaseSchema.superRefine((data, ctx) => {
    if (normalizedExisting.has(data.shortCode)) {
      ctx.addIssue({
        code: 'custom',
        path: ['shortCode'],
        message: 'Ya existe un aparato/sistema con ese código corto.',
      })
    }
  })
}

export const bodySystemFormDefaultValues: BodySystemFormValues = {
  name: '',
  shortCode: '',
  cie10Chapter: '',
  description: '',
}
