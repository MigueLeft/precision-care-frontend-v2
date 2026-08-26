import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import type { SymptomCatalog } from '../types'

interface SymptomRowProps {
  symptom: SymptomCatalog
  bodySystemName?: string
  onEdit: () => void
  onToggleActive: () => void
}

export function SymptomRow({ symptom, bodySystemName, onEdit, onToggleActive }: SymptomRowProps) {
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{symptom.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>{symptom.cie10Code ?? '—'}</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px', color: bodySystemName ? 'text.primary' : 'text.secondary' }}>
          {bodySystemName ?? '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip label={symptom.active ? 'Activo' : 'Inactivo'} size="small" color={symptom.active ? 'success' : 'default'} />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Editar">
          <IconButton size="small" onClick={onEdit} aria-label="Editar síntoma">
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={symptom.active ? 'Desactivar' : 'Activar'}>
          <IconButton size="small" onClick={onToggleActive} aria-label="Cambiar estado del síntoma">
            <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
