import { useState } from 'react'
import { Stack, TextField, InputAdornment, FormControlLabel, Checkbox } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { useUsers } from '../hooks/useUsers'
import { useCreateUser } from '../hooks/useCreateUser'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { useDeleteUser } from '../hooks/useDeleteUser'
import { useRestoreUser } from '../hooks/useRestoreUser'
import { filterUsers } from '../utils/filter-users'
import { mapUserToFormValues } from '../utils/map-user-to-form-values'
import { mapUserFormToCreatePayload, mapUserFormToUpdatePayload } from '../utils/map-user-form-to-payload'
import { userFormDefaultValues } from '../schemas/user-form.schema'
import { UsersTable } from './UsersTable'
import { UserFormModal } from './UserFormModal'
import { DeleteUserDialog } from './DeleteUserDialog'
import type { UserFormValues } from '../schemas/user-form.schema'

export function UsersTab() {
  const [q, setQ] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: users = [] } = useUsers(showDeleted)

  const filtered = filterUsers(users, q)
  const editingUser = users.find((u) => u.id === editingId) ?? null
  const deletingUser = users.find((u) => u.id === deletingId) ?? null

  const createMutation = useCreateUser({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateUser(editingId ?? undefined, { onSuccess: () => setEditingId(null) })
  const deleteMutation = useDeleteUser({ onSuccess: () => setDeletingId(null) })
  const restoreMutation = useRestoreUser()

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: UserFormValues = isCreateOpen
    ? userFormDefaultValues
    : editingUser
      ? mapUserToFormValues(editingUser)
      : userFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: UserFormValues) {
    if (isCreateOpen) {
      createMutation.mutate(mapUserFormToCreatePayload(values))
    } else if (editingId) {
      updateMutation.mutate(mapUserFormToUpdatePayload(values))
    }
  }

  return (
    <div>
      <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
        <TextField
          placeholder="Buscar usuario…"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          sx={{ minWidth: 280 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} />
          }
          label="Mostrar eliminados"
        />
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsCreateOpen(true)}
          sx={{ ml: 'auto' }}
        >
          Nuevo usuario
        </AppButton>
      </Stack>

      <UsersTable
        users={filtered}
        onEdit={(id) => setEditingId(id)}
        onDelete={(id) => setDeletingId(id)}
        onRestore={(id) => restoreMutation.mutate(id)}
      />

      <UserFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <DeleteUserDialog
        open={deletingId !== null}
        userName={deletingUser ? `${deletingUser.name} ${deletingUser.lastName}` : undefined}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </div>
  )
}
