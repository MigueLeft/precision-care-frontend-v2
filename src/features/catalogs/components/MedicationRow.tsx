import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import type { Medication } from '../types'

interface MedicationRowProps {
  medication: Medication
  presentationNameById: Map<number, string>
  categoryNameById: Map<number, string>
  onEdit: () => void
  onToggleActive: () => void
}

export function MedicationRow({
  medication,
  presentationNameById,
  categoryNameById,
  onEdit,
  onToggleActive,
}: MedicationRowProps) {
  const categoryName = medication.categoryId ? categoryNameById.get(medication.categoryId) : undefined

  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{medication.brandName}</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>{medication.genericName}</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>
          {presentationNameById.get(medication.presentationId) ?? '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: 'text.secondary' }}>
          {medication.concentration ?? '—'}
        </Typography>
      </TableCell>
      <TableCell>
        {categoryName ? (
          <Chip label={categoryName} size="small" color="info" variant="outlined" />
        ) : (
          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>—</Typography>
        )}
      </TableCell>
      <TableCell>
        <Chip
          label={medication.active ? 'Activo' : 'Inactivo'}
          size="small"
          color={medication.active ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Editar">
          <IconButton size="small" onClick={onEdit} aria-label="Editar medicamento">
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={medication.active ? 'Desactivar' : 'Activar'}>
          <IconButton size="small" onClick={onToggleActive} aria-label="Cambiar estado del medicamento">
            <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
