import { z } from 'zod'
import { requiredTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const intakeFormSchema = z.object({
  name: requiredTextSchema('El nombre', 150),
  description: optionalTextSchema(500),
  type: z.enum(['lifestyle', 'psychometric', 'antecedents', 'other'], {
    error: 'Selecciona un tipo de ingresable.',
  }),
})

export type IntakeFormValues = z.infer<typeof intakeFormSchema>

export const intakeFormDefaultValues: IntakeFormValues = {
  name: '',
  description: '',
  type: 'other',
}
