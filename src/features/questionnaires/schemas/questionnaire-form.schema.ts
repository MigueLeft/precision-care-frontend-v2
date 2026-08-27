import { z } from 'zod'
import { requiredTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const questionnaireFormSchema = z.object({
  name: requiredTextSchema('El nombre', 150),
  description: optionalTextSchema(500),
  type: z.enum(['lifestyle', 'psychometric', 'antecedents', 'other'], {
    error: 'Selecciona un tipo de ingresable.',
  }),
})

export type QuestionnaireFormValues = z.infer<typeof questionnaireFormSchema>

export const questionnaireFormDefaultValues: QuestionnaireFormValues = {
  name: '',
  description: '',
  type: 'other',
}
