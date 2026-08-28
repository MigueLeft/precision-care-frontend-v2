import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined'
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
  onRestore: () => void
}

export function UserRow({ user, onEdit, onDelete, onRestore }: UserRowProps) {
  const isDeleted = !!user.deletedAt

  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 }, opacity: isDeleted ? 0.6 : 1 }}>
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
        {isDeleted ? (
          <Chip label="Eliminado" size="small" color="error" />
        ) : (
          <Chip label={user.active ? 'Activo' : 'Inactivo'} size="small" color={user.active ? 'success' : 'default'} />
        )}
      </TableCell>
      <TableCell align="right">
        {isDeleted ? (
          <Tooltip title="Restaurar">
            <IconButton size="small" onClick={onRestore} aria-label="Restaurar usuario">
              <RestoreFromTrashOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <>
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
          </>
        )}
      </TableCell>
    </TableRow>
  )
}
