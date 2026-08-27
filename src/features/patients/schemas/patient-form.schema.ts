import { z } from 'zod'
import { lettersOnlySchema, optionalLettersOnlySchema } from '@/utils/text-validation'

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

// Solo los campos esenciales del modal de creación/edición — el resto de los
// campos del DTO del backend (dirección, estado civil, raza, etc.) se difieren
// a una futura pantalla de perfil completo.
export const patientFormSchema = z.object({
  firstName: lettersOnlySchema('El primer nombre', 60),
  middleName: optionalLettersOnlySchema('El segundo nombre', 60),
  lastName: lettersOnlySchema('El primer apellido', 60),
  secondLastName: optionalLettersOnlySchema('El segundo apellido', 60),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de nacimiento debe tener formato YYYY-MM-DD.')
    .refine((value) => value <= todayIsoDate(), 'La fecha de nacimiento no puede ser una fecha futura.'),
  email: z.string().email('El correo no tiene un formato válido.').optional().or(z.literal('')),
  nationalityCountryId: z.number().int().positive().optional(),
  residenceCountryId: z.number().int().positive().optional(),
})

export type PatientFormValues = z.infer<typeof patientFormSchema>

export const patientFormDefaultValues: PatientFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  secondLastName: '',
  birthDate: '',
  email: '',
  nationalityCountryId: undefined,
  residenceCountryId: undefined,
}
