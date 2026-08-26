import { z } from 'zod'

export const symptomFormSchema = z.object({
  name: z.string().min(1, 'El nombre del síntoma es requerido.'),
  cie10Code: z.string().optional().or(z.literal('')),
  bodySystemId: z.number().int().positive().optional(),
})

export type SymptomFormValues = z.infer<typeof symptomFormSchema>

export const symptomFormDefaultValues: SymptomFormValues = {
  name: '',
  cie10Code: '',
  bodySystemId: undefined,
}
