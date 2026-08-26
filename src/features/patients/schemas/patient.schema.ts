import { z } from 'zod'

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'El primer nombre es requerido.'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'El primer apellido es requerido.'),
  secondLastName: z.string().optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de nacimiento debe tener formato YYYY-MM-DD.'),
  email: z.string().email('El correo no tiene un formato válido.').optional(),
  nationalityCountryId: z.number().int().positive().optional(),
  originCountryId: z.number().int().positive().optional(),
  residenceCountryId: z.number().int().positive().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  civilStatusId: z.number().int().positive().optional(),
  raceId: z.number().int().positive().optional(),
  socioeconomicLevelId: z.number().int().positive().optional(),
  languageIds: z.array(z.number().int().positive()).optional(),
})

export const updatePatientSchema = createPatientSchema.partial()

export type CreatePatientDto = z.infer<typeof createPatientSchema>
export type UpdatePatientDto = z.infer<typeof updatePatientSchema>
