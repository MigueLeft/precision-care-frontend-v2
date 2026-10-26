import type { ReactNode } from 'react'
import { EmptyState } from '@/components/EmptyState'
import { useCan } from '../hooks/useCan'

type PermissionGateProps = {
  permission: string
  children: ReactNode
  // Qué mostrar sin permiso: por defecto un aviso (pantallas); null para acciones.
  fallback?: ReactNode
}

// Muestra `children` solo si el usuario tiene el permiso.
export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const { can, isLoading } = useCan()
  if (isLoading) return null
  if (can(permission)) return <>{children}</>
  return fallback === undefined ? (
    <EmptyState message="No tienes permiso para ver esta sección." />
  ) : (
    <>{fallback}</>
  )
}
