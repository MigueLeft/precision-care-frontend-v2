import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import type { ExamCatalog } from '../types'

interface ExamRowProps {
  exam: ExamCatalog
  categoryNameById: Map<number, string>
  onEdit: () => void
  onToggleActive: () => void
}

export function ExamRow({ exam, categoryNameById, onEdit, onToggleActive }: ExamRowProps) {
  const referenceRange =
    exam.referenceMin || exam.referenceMax ? `${exam.referenceMin ?? '—'} – ${exam.referenceMax ?? '—'}` : '—'

  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{exam.name}</Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={categoryNameById.get(exam.categoryId) ?? '—'}
          size="small"
          color="info"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>{exam.defaultUnit ?? '—'}</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: 'text.secondary' }}>
          {referenceRange}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip label={exam.active ? 'Activo' : 'Inactivo'} size="small" color={exam.active ? 'success' : 'default'} />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Editar">
          <IconButton size="small" onClick={onEdit} aria-label="Editar examen">
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={exam.active ? 'Desactivar' : 'Activar'}>
          <IconButton size="small" onClick={onToggleActive} aria-label="Cambiar estado del examen">
            <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
