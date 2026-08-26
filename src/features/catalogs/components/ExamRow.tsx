import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import type { ExamCatalog } from '../types'

const CATEGORY_LABELS: Record<ExamCatalog['category'], string> = {
  laboratory: 'Laboratorio',
  imaging: 'Imagenología',
  cardiology: 'Cardiología',
  other: 'Otro',
}

interface ExamRowProps {
  exam: ExamCatalog
  onEdit: () => void
  onToggleActive: () => void
}

export function ExamRow({ exam, onEdit, onToggleActive }: ExamRowProps) {
  const referenceRange =
    exam.referenceMin || exam.referenceMax ? `${exam.referenceMin ?? '—'} – ${exam.referenceMax ?? '—'}` : '—'

  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{exam.name}</Typography>
      </TableCell>
      <TableCell>
        <Chip label={CATEGORY_LABELS[exam.category]} size="small" color="info" variant="outlined" />
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
