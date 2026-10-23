import { z } from 'zod'
import { lettersOnlySchema, optionalLettersOnlySchema } from '@/utils/text-validation'
import { isValidPhone } from '@/utils/phone'

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
  identityDocument: z
    .string()
    .trim()
    .max(30, 'Máximo 30 caracteres.')
    .regex(/^\d*$/, 'La cédula solo debe contener números.')
    .optional()
    .or(z.literal('')),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de nacimiento debe tener formato YYYY-MM-DD.')
    .refine((value) => value <= todayIsoDate(), 'La fecha de nacimiento no puede ser una fecha futura.'),
  email: z.string().email('El correo no tiene un formato válido.').optional().or(z.literal('')),
  // Opcional; si se escribe debe ser un número válido para el país elegido.
  phone: z
    .string()
    .refine((value) => value === '' || isValidPhone(value), 'El teléfono no es válido para el país elegido.'),
  nationalityCountryId: z.number().int().positive().optional(),
  residenceCountryId: z.number().int().positive().optional(),
})

export type PatientFormValues = z.infer<typeof patientFormSchema>

export const patientFormDefaultValues: PatientFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  secondLastName: '',
  identityDocument: '',
  birthDate: '',
  email: '',
  phone: '',
  nationalityCountryId: undefined,
  residenceCountryId: undefined,
}
