import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import { Link } from '@tanstack/react-router'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import type { Intake } from '../types'

const TYPE_LABELS: Record<Intake['type'], string> = {
  lifestyle: 'Estilo de vida',
  psychometric: 'Psicométrico',
  antecedents: 'Antecedentes',
  other: 'Otro',
}

interface IntakeRowProps {
  intake: Intake
  onEdit: () => void
  onDelete: () => void
}

export function IntakeRow({ intake, onEdit, onDelete }: IntakeRowProps) {
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell sx={{ maxWidth: 320, wordBreak: 'break-word' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 600, wordBreak: 'break-word' }}>
          {intake.name}
        </Typography>
        {intake.description && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary', wordBreak: 'break-word' }}>
            {intake.description}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Chip label={TYPE_LABELS[intake.type]} size="small" color="info" variant="outlined" />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>
          {intake.currentVersionId ? 'Publicado' : 'Sin publicar'}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={intake.active ? 'Activo' : 'Inactivo'}
          size="small"
          color={intake.active ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        <Tooltip title="Ver / editar contenido">
          <Link to="/ingresables/$id" params={{ id: String(intake.id) }}>
            <IconButton size="small" component="span" aria-label="Ver ingresable">
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Editar datos generales">
          <IconButton size="small" onClick={onEdit} aria-label="Editar ingresable">
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton size="small" onClick={onDelete} aria-label="Eliminar ingresable">
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
