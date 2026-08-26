import { z } from 'zod'

export const medicationFormSchema = z.object({
  brandName: z.string().min(1, 'El nombre comercial es requerido.'),
  genericName: z.string().min(1, 'El nombre genérico es requerido.'),
  presentation: z.string().min(1, 'La presentación es requerida.'),
  concentration: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
})

export type MedicationFormValues = z.infer<typeof medicationFormSchema>

export const medicationFormDefaultValues: MedicationFormValues = {
  brandName: '',
  genericName: '',
  presentation: '',
  concentration: '',
  category: '',
}
