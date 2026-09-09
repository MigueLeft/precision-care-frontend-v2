import { z } from 'zod'
import { alphanumericTextSchema } from '@/utils/text-validation'

export const diseaseFormSchema = z.object({
  name: alphanumericTextSchema('El nombre de la enfermedad', 150),
  code: z.string().trim().max(20).optional().or(z.literal('')),
  isChronic: z.boolean(),
  // Aparato/sistema preestablecido; se congela en cada enfermedad del paciente.
  bodySystemId: z.number().int().positive().nullable(),
})

export type DiseaseFormValues = z.infer<typeof diseaseFormSchema>

export const diseaseFormDefaultValues: DiseaseFormValues = {
  name: '',
  code: '',
  isChronic: false,
  bodySystemId: null,
}
