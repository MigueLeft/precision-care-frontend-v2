import type { CurrentUser } from '../services/me.service'

// Permiso para ver todas las citas y consultas sin ser el médico tratante.
export const VIEW_ALL_APPOINTMENTS = 'citas_todas:read'

// Un especialista solo ve lo suyo salvo que tenga el permiso; los demás
// usuarios (administración, recepción) ven todo.
export function canViewAllAppointments(me: CurrentUser | null | undefined): boolean {
  if (!me) return false
  return me.specialistId == null || me.permissions.includes(VIEW_ALL_APPOINTMENTS)
}

// Permiso para ver las citas sin confirmar (asistente/admin). Sin él, la
// agenda solo muestra las confirmadas (el backend también las filtra).
export const VIEW_UNCONFIRMED_APPOINTMENTS = 'citas_sin_confirmar:read'

export function canViewUnconfirmedAppointments(me: CurrentUser | null | undefined): boolean {
  return !!me?.permissions.includes(VIEW_UNCONFIRMED_APPOINTMENTS)
}

// Scores de riesgo cardiometabólico (FINDRISC, Globorisk, perfil de factores).
export function canViewRisk(me: CurrentUser | null | undefined): boolean {
  return !!me?.permissions.includes('riesgo:read')
}

// Confirmar / quitar confirmación: quien ve las sin confirmar y puede editar citas.
export function canConfirmAppointments(me: CurrentUser | null | undefined): boolean {
  return canViewUnconfirmedAppointments(me) && !!me?.permissions.includes('citas:update')
}
