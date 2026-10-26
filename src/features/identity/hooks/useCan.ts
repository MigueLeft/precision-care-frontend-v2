import { hasPermission } from '../utils/permissions'
import { useMe } from './useMe'

// `can('pacientes:create')` → si el usuario de la sesión tiene ese permiso.
// Mientras carga la sesión devuelve false (las acciones aparecen al confirmarse).
export function useCan() {
  const { data: me, isLoading } = useMe()
  return {
    can: (code: string) => hasPermission(me, code),
    me,
    isLoading,
  }
}
