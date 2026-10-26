import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/features/identity'
import { IdentityPage, identityKeys, fetchUsers, fetchRoles, fetchPermissions } from '@/features/identity'

export const Route = createFileRoute('/_app/usuarios-y-roles')({
  beforeLoad: requirePermission('usuarios:read'),
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData({
        queryKey: [...identityKeys.users, { includeDeleted: false }] as const,
        queryFn: () => fetchUsers(false),
      }),
      queryClient.ensureQueryData({ queryKey: identityKeys.roles, queryFn: fetchRoles }),
      queryClient.ensureQueryData({ queryKey: identityKeys.permissions, queryFn: fetchPermissions }),
    ]),
  component: IdentityPage,
})
