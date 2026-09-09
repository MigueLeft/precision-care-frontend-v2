import { z } from 'zod'
import { alphanumericTextSchema } from '@/utils/text-validation'

export const diseaseFormSchema = z.object({
  name: alphanumericTextSchema('El nombre de la enfermedad', 150),
  isChronic: z.boolean(),
})

export type DiseaseFormValues = z.infer<typeof diseaseFormSchema>

export const diseaseFormDefaultValues: DiseaseFormValues = {
  name: '',
  isChronic: false,
}
