import { z } from 'zod'
import { requiredTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const symptomFormSchema = z.object({
  name: requiredTextSchema('El nombre del síntoma', 150),
  cie10Code: optionalTextSchema(10),
  bodySystemId: z.number().int().positive().optional(),
})

export type SymptomFormValues = z.infer<typeof symptomFormSchema>

export const symptomFormDefaultValues: SymptomFormValues = {
  name: '',
  cie10Code: '',
  bodySystemId: undefined,
}
