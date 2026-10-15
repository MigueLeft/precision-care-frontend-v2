import { z } from 'zod'
import { optionalTextSchema } from '@/utils/text-validation'

// Igual que el DTO del backend (CreateLabProfileSchema).
export const labProfileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del perfil es requerido.')
    .max(120, 'El nombre no debe superar los 120 caracteres.'),
  description: optionalTextSchema(300),
  paraclinicalIds: z.array(z.number().int().positive()).min(1, 'Agrega al menos un estudio al perfil.'),
})

export type LabProfileFormValues = z.infer<typeof labProfileFormSchema>

export const labProfileFormDefaultValues: LabProfileFormValues = {
  name: '',
  description: '',
  paraclinicalIds: [],
}
