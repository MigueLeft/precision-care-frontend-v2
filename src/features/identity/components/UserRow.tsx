import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { AssignRoleSelect } from './AssignRoleSelect'
import type { UserAccount } from '../types'

const TYPE_LABELS: Record<UserAccount['type'], string> = {
  patient: 'Paciente',
  specialist: 'Especialista',
  administrative: 'Administrativo',
}

interface UserRowProps {
  user: UserAccount
  onEdit: () => void
  onDelete: () => void
}

export function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
          {user.name} {user.lastName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>{user.email}</Typography>
      </TableCell>
      <TableCell>
        <Chip label={TYPE_LABELS[user.type]} size="small" variant="outlined" />
      </TableCell>
      <TableCell>
        <AssignRoleSelect userId={user.id} roleId={user.roleId} />
      </TableCell>
      <TableCell>
        <Chip label={user.active ? 'Activo' : 'Inactivo'} size="small" color={user.active ? 'success' : 'default'} />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Editar">
          <IconButton size="small" onClick={onEdit} aria-label="Editar usuario">
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton size="small" onClick={onDelete} aria-label="Eliminar usuario">
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
