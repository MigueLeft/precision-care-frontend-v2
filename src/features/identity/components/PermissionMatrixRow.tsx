import { TableRow, TableCell, Typography } from '@mui/material'
import { PermissionCell } from './PermissionCell'
import { MATRIX_ACTIONS, matrixKey } from '../utils/permission-matrix'
import { getModuleLabel } from '../utils/module-labels'
import type { PermissionMatrix } from '../utils/permission-matrix'

interface PermissionMatrixRowProps {
  module: string
  matrix: PermissionMatrix
  onToggle: (module: string, action: (typeof MATRIX_ACTIONS)[number]) => void
}

export function PermissionMatrixRow({ module, matrix, onToggle }: PermissionMatrixRowProps) {
  return (
    <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{getModuleLabel(module)}</Typography>
      </TableCell>
      {MATRIX_ACTIONS.map((action) => (
        <TableCell key={action} sx={{ px: 1 }}>
          <PermissionCell checked={matrix[matrixKey(module, action)]} onChange={() => onToggle(module, action)} />
        </TableCell>
      ))}
    </TableRow>
  )
}
