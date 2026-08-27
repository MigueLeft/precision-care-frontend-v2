import { z } from 'zod'
import { requiredTextSchema } from '@/utils/text-validation'

export const QUESTION_TYPES_WITH_OPTIONS = ['single_choice', 'multiple_choice', 'scale'] as const

const questionOptionFormSchema = z.object({
  text: requiredTextSchema('El texto de la opción', 200),
  value: requiredTextSchema('El valor de la opción', 100),
  score: z.number({ error: 'El puntaje debe ser un número.' }),
})

export type QuestionOptionFormValues = z.infer<typeof questionOptionFormSchema>

export const questionFormSchema = z
  .object({
    text: requiredTextSchema('El texto de la pregunta', 500),
    type: z.enum(
      ['single_choice', 'multiple_choice', 'scale', 'free_text', 'numeric', 'date', 'boolean'],
      { error: 'Selecciona un tipo de pregunta.' },
    ),
    required: z.boolean(),
    options: z.array(questionOptionFormSchema),
  })
  .superRefine((data, ctx) => {
    if (
      QUESTION_TYPES_WITH_OPTIONS.includes(
        data.type as (typeof QUESTION_TYPES_WITH_OPTIONS)[number],
      ) &&
      data.options.length < 2
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['options'],
        message: 'Agrega al menos 2 opciones para este tipo de pregunta.',
      })
    }
  })

export type QuestionFormValues = z.infer<typeof questionFormSchema>

export const questionFormDefaultValues: QuestionFormValues = {
  text: '',
  type: 'single_choice',
  required: false,
  options: [],
}

export function questionTypeHasOptions(type: string): boolean {
  return QUESTION_TYPES_WITH_OPTIONS.includes(
    type as (typeof QUESTION_TYPES_WITH_OPTIONS)[number],
  )
}
