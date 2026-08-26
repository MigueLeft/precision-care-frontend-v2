import { createFileRoute } from '@tanstack/react-router'
import { IdentityPage, identityKeys, fetchUsers, fetchRoles, fetchPermissions } from '@/features/identity'

export const Route = createFileRoute('/_app/usuarios-y-roles')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData({ queryKey: identityKeys.users, queryFn: fetchUsers }),
      queryClient.ensureQueryData({ queryKey: identityKeys.roles, queryFn: fetchRoles }),
      queryClient.ensureQueryData({ queryKey: identityKeys.permissions, queryFn: fetchPermissions }),
    ]),
  component: IdentityPage,
})
