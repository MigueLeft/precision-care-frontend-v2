import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { useRoles } from '../hooks/useRoles'
import { useCreateRole } from '../hooks/useCreateRole'
import { useUpdateRole } from '../hooks/useUpdateRole'
import { useDeleteRole } from '../hooks/useDeleteRole'
import { mapRoleToFormValues } from '../utils/map-role-to-form-values'
import { mapRoleFormToPayload } from '../utils/map-role-form-to-payload'
import { roleFormDefaultValues } from '../schemas/role-form.schema'
import { RoleCard } from './RoleCard'
import { RoleFormModal } from './RoleFormModal'
import { DeleteRoleDialog } from './DeleteRoleDialog'
import { PermissionsMatrixDrawer } from './PermissionsMatrixDrawer'
import type { RoleFormValues } from '../schemas/role-form.schema'

export function RolesTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [viewingPermissionsId, setViewingPermissionsId] = useState<number | null>(null)
  const [duplicateFrom, setDuplicateFrom] = useState<RoleFormValues | null>(null)

  const { data: roles = [] } = useRoles()

  const editingRole = roles.find((r) => r.id === editingId) ?? null
  const deletingRole = roles.find((r) => r.id === deletingId) ?? null
  const viewingRole = roles.find((r) => r.id === viewingPermissionsId) ?? null

  const createMutation = useCreateRole({ onSuccess: () => closeForm() })
  const updateMutation = useUpdateRole(editingId ?? undefined, { onSuccess: () => closeForm() })
  const deleteMutation = useDeleteRole({ onSuccess: () => setDeletingId(null) })

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = editingId !== null ? 'edit' : 'create'
  const formInitialValues: RoleFormValues = editingRole
    ? mapRoleToFormValues(editingRole)
    : (duplicateFrom ?? roleFormDefaultValues)

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
    setDuplicateFrom(null)
  }

  function handleSubmit(values: RoleFormValues) {
    const payload = mapRoleFormToPayload(values)
    if (editingId) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 3 }}>
        <AppButton variant="contained" startIcon={<AddIcon sx={{ fontSize: 18 }} />} onClick={() => setIsCreateOpen(true)}>
          Nuevo rol
        </AppButton>
      </Stack>

      <Stack spacing={2}>
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onViewPermissions={() => setViewingPermissionsId(role.id)}
            onDuplicate={() => setDuplicateFrom({ name: `${role.name} (copia)`, description: role.description ?? '' })}
            onDelete={() => setDeletingId(role.id)}
          />
        ))}
      </Stack>

      {roles.length === 0 && (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Aún no hay roles configurados.
        </Typography>
      )}

      <RoleFormModal
        open={isFormOpen || duplicateFrom !== null}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <DeleteRoleDialog
        open={deletingId !== null}
        roleName={deletingRole?.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />

      <PermissionsMatrixDrawer role={viewingRole} onClose={() => setViewingPermissionsId(null)} />
    </div>
  )
}
