import { z } from 'zod'

// Solo los campos esenciales del modal de creación/edición — el resto de los
// campos del DTO del backend (dirección, estado civil, raza, etc.) se difieren
// a una futura pantalla de perfil completo.
export const patientFormSchema = z.object({
  firstName: z.string().min(1, 'El primer nombre es requerido.'),
  middleName: z.string().optional().or(z.literal('')),
  lastName: z.string().min(1, 'El primer apellido es requerido.'),
  secondLastName: z.string().optional().or(z.literal('')),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de nacimiento debe tener formato YYYY-MM-DD.'),
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
