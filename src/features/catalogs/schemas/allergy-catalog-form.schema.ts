import { z } from 'zod'
import { lettersOnlySchema } from '@/utils/text-validation'

export const allergyCatalogFormSchema = z.object({
  name: lettersOnlySchema('El nombre de la alergia', 150),
  typeId: z
    .number({ error: 'El tipo de alergia es requerido.' })
    .int()
    .positive('El tipo de alergia es requerido.'),
})

export type AllergyCatalogFormValues = z.infer<typeof allergyCatalogFormSchema>

export const allergyCatalogFormDefaultValues: AllergyCatalogFormValues = {
  name: '',
  typeId: 0,
}
