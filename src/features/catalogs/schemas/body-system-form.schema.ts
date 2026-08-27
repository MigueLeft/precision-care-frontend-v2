import { z } from 'zod'
import { lettersOnlySchema, optionalTextSchema } from '@/utils/text-validation'

export const bodySystemFormSchema = z.object({
  name: lettersOnlySchema('El nombre', 100),
  shortCode: z
    .string()
    .trim()
    .min(1, 'El código corto es requerido.')
    .max(20, 'El código corto no debe superar los 20 caracteres.')
    .regex(/^[A-Za-z0-9-]+$/, 'El código corto solo puede contener letras, números y guiones.'),
  cie10Chapter: optionalTextSchema(20),
  description: optionalTextSchema(500),
})

export type BodySystemFormValues = z.infer<typeof bodySystemFormSchema>

export const bodySystemFormDefaultValues: BodySystemFormValues = {
  name: '',
  shortCode: '',
  cie10Chapter: '',
  description: '',
}
