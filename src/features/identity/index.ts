export { IdentityPage } from './components/IdentityPage'
export { identityKeys } from './hooks/identity.keys'
export { fetchUsers } from './services/users.service'
export { fetchRoles } from './services/roles.service'
export { useRoles } from './hooks/useRoles'
export { fetchPermissions } from './services/permissions.service'
export { useSpecialistsLookup } from './hooks/useSpecialistsLookup'
export { fetchSpecialistsLookup } from './services/specialists-lookup.service'
export { useMe } from './hooks/useMe'
export { useCan } from './hooks/useCan'
export { PermissionGate } from './components/PermissionGate'
export { requirePermission } from './utils/route-guard'
export { hasPermission, PAGE_PERMISSIONS, RECORD_TAB_PERMISSIONS } from './utils/permissions'
export { fetchMe } from './services/me.service'
export type { CurrentUser } from './services/me.service'
export type { UserAccount, Role, Permission, UserType, SpecialistLookup } from './types'
export {
  canViewAllAppointments,
  canViewUnconfirmedAppointments,
  canConfirmAppointments,
  canViewRisk,
  VIEW_ALL_APPOINTMENTS,
  VIEW_UNCONFIRMED_APPOINTMENTS,
} from './utils/access'
