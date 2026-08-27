import { z } from 'zod'
import { requiredTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const cie10FormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'El código es requerido.')
    .max(10, 'El código no debe superar los 10 caracteres.')
    .regex(/^[A-Za-z0-9.]+$/, 'El código solo puede contener letras, números y puntos.')
    .transform((value) => value.toUpperCase()),
  description: requiredTextSchema('La descripción', 200),
  chapter: optionalTextSchema(20),
  bodySystemId: z.number().int().positive().optional(),
})

export type Cie10FormValues = z.infer<typeof cie10FormSchema>

export const cie10FormDefaultValues: Cie10FormValues = {
  code: '',
  description: '',
  chapter: '',
  bodySystemId: undefined,
}
