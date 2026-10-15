import type { CurrentUser } from '../services/me.service'

// Permiso para ver todas las citas y consultas sin ser el médico tratante.
export const VIEW_ALL_APPOINTMENTS = 'citas_todas:read'

// Un especialista solo ve lo suyo salvo que tenga el permiso; los demás
// usuarios (administración, recepción) ven todo.
export function canViewAllAppointments(me: CurrentUser | null | undefined): boolean {
  if (!me) return false
  return me.specialistId == null || me.permissions.includes(VIEW_ALL_APPOINTMENTS)
}
