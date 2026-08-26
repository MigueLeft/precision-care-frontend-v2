import { z } from 'zod'

export const userTypeOptions = ['patient', 'specialist', 'administrative'] as const

export function getUserFormSchema(mode: 'create' | 'edit') {
  return z.object({
    email: z.string().email('El correo no tiene un formato válido.'),
    password:
      mode === 'create'
        ? z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.')
        : z.string().optional(),
    name: z.string().min(1, 'El nombre es requerido.'),
    lastName: z.string().min(1, 'El apellido es requerido.'),
    type: z.enum(userTypeOptions, { error: 'Selecciona un tipo de usuario.' }),
    patientId: z.number().int().positive().optional(),
    specialistId: z.number().int().positive().optional(),
  })
}

export type UserFormValues = z.infer<ReturnType<typeof getUserFormSchema>>

export const userFormDefaultValues: UserFormValues = {
  email: '',
  password: '',
  name: '',
  lastName: '',
  type: 'administrative',
  patientId: undefined,
  specialistId: undefined,
}
