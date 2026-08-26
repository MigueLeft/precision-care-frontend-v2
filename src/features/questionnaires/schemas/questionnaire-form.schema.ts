import { z } from 'zod'

export const questionnaireFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  description: z.string().optional().or(z.literal('')),
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
