import { z } from 'zod'
import { lettersOnlySchema } from '@/utils/text-validation'

const optionalId = z.number().int().positive().optional()

// Teléfono: solo dígitos y separadores comunes (+, espacio, guion, paréntesis).
// Nada de letras ni puntos.
const PHONE_REGEX = /^[\d\s+()-]+$/

export function getSpecialistFormSchema() {
  return z
    .object({
      name: lettersOnlySchema('El nombre', 60),
      lastName: lettersOnlySchema('El apellido', 60),
      email: z.string().email('El correo no tiene un formato válido.'),
      phone: z
        .string()
        .trim()
        .max(30, 'El teléfono no debe superar los 30 caracteres.')
        .regex(PHONE_REGEX, 'El teléfono solo puede contener números.')
        .optional()
        .or(z.literal('')),
      nationalityCountryId: z
        .number({ error: 'La nacionalidad es requerida.' })
        .int()
        .positive('La nacionalidad es requerida.'),
      residenceCountryId: z
        .number({ error: 'El país de residencia es requerido.' })
        .int()
        .positive('El país de residencia es requerido.'),
      stateId: optionalId,
      cityId: optionalId,
      primarySpecialtyId: z
        .number({ error: 'La especialidad es requerida.' })
        .int()
        .positive('La especialidad es requerida.'),
      otherSpecialtyIds: z.array(z.number().int().positive()),
      practiceAddress: z.string().trim().max(255).optional().or(z.literal('')),
      createUser: z.boolean(),
      roleId: optionalId,
      initialStatus: z.enum(['active', 'inactive']),
      passwordMode: z.enum(['invite', 'temporary']),
    })
    .superRefine((values, ctx) => {
      if (values.createUser && !values.roleId) {
        ctx.addIssue({
          code: 'custom',
          path: ['roleId'],
          message: 'El rol es requerido para crear el usuario.',
        })
      }
    })
}

export type SpecialistFormValues = z.infer<
  ReturnType<typeof getSpecialistFormSchema>
>

export const specialistFormDefaultValues: SpecialistFormValues = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  nationalityCountryId: 0,
  residenceCountryId: 0,
  stateId: undefined,
  cityId: undefined,
  primarySpecialtyId: 0,
  otherSpecialtyIds: [],
  practiceAddress: '',
  createUser: true,
  roleId: undefined,
  initialStatus: 'active',
  passwordMode: 'invite',
}
