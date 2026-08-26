import { Select, MenuItem } from '@mui/material'
import { useRoles } from '../hooks/useRoles'
import { useAssignUserRole } from '../hooks/useAssignUserRole'

interface AssignRoleSelectProps {
  userId: number
  roleId: number | null
}

export function AssignRoleSelect({ userId, roleId }: AssignRoleSelectProps) {
  const { data: roles = [] } = useRoles()
  const assignRole = useAssignUserRole()

  return (
    <Select<number | ''>
      size="small"
      value={roleId ?? ''}
      displayEmpty
      disabled={assignRole.isPending}
      onChange={(event) => {
        const value = event.target.value
        if (value !== '') assignRole.mutate({ userId, roleId: Number(value) })
      }}
      sx={{ fontSize: '13px', minWidth: 160 }}
    >
      <MenuItem value="" disabled>
        Sin rol asignado
      </MenuItem>
      {roles.map((role) => (
        <MenuItem key={role.id} value={role.id}>
          {role.name}
        </MenuItem>
      ))}
    </Select>
  )
}
