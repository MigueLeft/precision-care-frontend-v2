import { z } from 'zod'
import { requiredTextSchema, optionalTextSchema } from '@/utils/text-validation'

export const AHA_LIFESTYLE_COMPONENTS = [
  { value: '', label: 'Ninguno' },
  { value: 'diet', label: 'Dieta' },
  { value: 'physical_activity', label: 'Actividad física' },
  { value: 'nicotine_exposure', label: 'Exposición a nicotina' },
  { value: 'sleep', label: 'Sueño' },
  { value: 'bmi', label: 'IMC' },
  { value: 'blood_lipids', label: 'Lípidos en sangre' },
  { value: 'blood_glucose', label: 'Glucosa' },
  { value: 'blood_pressure', label: 'Presión arterial' },
] as const

export const sectionFormSchema = z.object({
  title: requiredTextSchema('El título de la sección', 150),
  description: optionalTextSchema(500),
  lifestyleComponent: z.string().optional().or(z.literal('')),
})

export type SectionFormValues = z.infer<typeof sectionFormSchema>

export const sectionFormDefaultValues: SectionFormValues = {
  title: '',
  description: '',
  lifestyleComponent: '',
}
