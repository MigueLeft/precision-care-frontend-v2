import { z } from 'zod'
import { requiredTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const medicationFormSchema = z.object({
  brandName: requiredTextSchema('El nombre comercial', 150),
  genericName: requiredTextSchema('El nombre genérico', 150),
  presentationId: z.number({ error: 'La presentación es requerida.' }).int().positive('La presentación es requerida.'),
  concentration: optionalTextSchema(50),
  categoryId: z.number().int().positive().optional(),
})

export type MedicationFormValues = z.infer<typeof medicationFormSchema>

export const medicationFormDefaultValues: MedicationFormValues = {
  brandName: '',
  genericName: '',
  presentationId: 0,
  concentration: '',
  categoryId: undefined,
}
