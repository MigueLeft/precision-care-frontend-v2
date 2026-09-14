import { z } from 'zod'

export const mappingFormSchema = z
  .object({
    scoringType: z.enum(['sum', 'weighted_sum', 'range_lookup', 'custom_function'], {
      error: 'Selecciona un tipo de puntuación.',
    }),
    destinationType: z.enum(
      ['patient_field', 'lifestyle', 'antecedent', 'allergy', 'body_composition', 'custom'],
      { error: 'Selecciona un destino.' },
    ),
    destinationTable: z.string().optional().or(z.literal('')),
    destinationField: z.string().optional().or(z.literal('')),
    handlerName: z.string().optional().or(z.literal('')),
    parametersJson: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.destinationType === 'patient_field' && !data.destinationField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destinationField'],
        message: 'Requerido cuando el destino es un campo del paciente.',
      })
    }
    if (data.parametersJson) {
      try {
        JSON.parse(data.parametersJson)
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['parametersJson'],
          message: 'Debe ser un JSON válido.',
        })
      }
    }
  })

export type MappingFormValues = z.infer<typeof mappingFormSchema>

export const mappingFormDefaultValues: MappingFormValues = {
  scoringType: 'sum',
  destinationType: 'antecedent',
  destinationTable: '',
  destinationField: '',
  handlerName: '',
  parametersJson: '',
}
