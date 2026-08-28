import { z } from 'zod'
import { requiredTextSchema } from '@/utils/text-validation'

export const symptomFormSchema = z.object({
  name: requiredTextSchema('El nombre del síntoma', 150),
})

export type SymptomFormValues = z.infer<typeof symptomFormSchema>

export const symptomFormDefaultValues: SymptomFormValues = {
  name: '',
}
