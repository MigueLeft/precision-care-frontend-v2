import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { UserRow } from './UserRow'
import type { UserAccount } from '../types'

interface UsersTableProps {
  users: UserAccount[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onRestore: (id: number) => void
}

const HEADERS = ['Nombre', 'Correo', 'Tipo', 'Rol', 'Estado', '']

export function UsersTable({ users, onEdit, onDelete, onRestore }: UsersTableProps) {
  if (users.length === 0) {
    return <EmptyState message="No se encontraron usuarios con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEADERS.map((header) => (
              <TableCell key={header} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={() => onEdit(user.id)}
              onDelete={() => onDelete(user.id)}
              onRestore={() => onRestore(user.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
