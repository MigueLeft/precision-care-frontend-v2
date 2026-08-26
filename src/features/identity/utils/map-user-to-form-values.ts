import type { UserAccount } from '../types'
import type { UserFormValues } from '../schemas/user-form.schema'

export function mapUserToFormValues(user: UserAccount): UserFormValues {
  return {
    email: user.email,
    password: '',
    name: user.name,
    lastName: user.lastName,
    type: user.type,
    patientId: user.patientId ?? undefined,
    specialistId: user.specialistId ?? undefined,
  }
}
