import type { UserFormValues } from '../schemas/user-form.schema'
import type { CreateUserPayload, UpdateUserPayload } from '../types'

export function mapUserFormToCreatePayload(values: UserFormValues): CreateUserPayload {
  return {
    email: values.email,
    password: values.password ?? '',
    name: values.name,
    lastName: values.lastName,
    type: values.type,
    patientId: values.type === 'patient' ? values.patientId : undefined,
    specialistId: values.type === 'specialist' ? values.specialistId : undefined,
  }
}

export function mapUserFormToUpdatePayload(values: UserFormValues): UpdateUserPayload {
  return {
    name: values.name,
    lastName: values.lastName,
    patientId: values.type === 'patient' ? values.patientId : undefined,
    specialistId: values.type === 'specialist' ? values.specialistId : undefined,
  }
}
