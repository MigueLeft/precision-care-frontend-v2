import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/features/identity'

export const Route = createFileRoute('/_app/contabilidad')({
  beforeLoad: requirePermission('contabilidad:read'),
})
