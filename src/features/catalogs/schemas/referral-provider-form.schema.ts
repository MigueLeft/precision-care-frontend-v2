import { z } from 'zod'
import { optionalTextSchema } from '@/utils/text-validation'

// Igual que el DTO del backend (CreateReferralProviderSchema).
export const referralProviderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del centro o especialista es requerido.')
    .max(150, 'El nombre no debe superar los 150 caracteres.'),
  specialty: optionalTextSchema(120),
  address: optionalTextSchema(300),
  phone: optionalTextSchema(100),
})

export type ReferralProviderFormValues = z.infer<typeof referralProviderFormSchema>

export const referralProviderFormDefaultValues: ReferralProviderFormValues = {
  name: '',
  specialty: '',
  address: '',
  phone: '',
}
