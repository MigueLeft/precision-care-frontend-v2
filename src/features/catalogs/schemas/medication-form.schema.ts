import { z } from 'zod'
import { requiredTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const medicationFormSchema = z.object({
  brandName: requiredTextSchema('El nombre comercial', 150),
  genericName: requiredTextSchema('El nombre genérico', 150),
  presentation: requiredTextSchema('La presentación', 100),
  concentration: optionalTextSchema(50),
  category: optionalTextSchema(100),
})

export type MedicationFormValues = z.infer<typeof medicationFormSchema>

export const medicationFormDefaultValues: MedicationFormValues = {
  brandName: '',
  genericName: '',
  presentation: '',
  concentration: '',
  category: '',
}
