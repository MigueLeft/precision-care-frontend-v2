import { TableRow, TableCell, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import { Link } from '@tanstack/react-router'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import type { Questionnaire } from '../types'

const TYPE_LABELS: Record<Questionnaire['type'], string> = {
  lifestyle: 'Estilo de vida',
  psychometric: 'Psicométrico',
  antecedents: 'Antecedentes',
  other: 'Otro',
}

interface QuestionnaireRowProps {
  questionnaire: Questionnaire
  onEdit: () => void
  onDelete: () => void
}

export function QuestionnaireRow({ questionnaire, onEdit, onDelete }: QuestionnaireRowProps) {
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{questionnaire.name}</Typography>
        {questionnaire.description && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {questionnaire.description}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Chip label={TYPE_LABELS[questionnaire.type]} size="small" color="info" variant="outlined" />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>
          {questionnaire.currentVersionId ? 'Publicado' : 'Sin publicar'}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={questionnaire.active ? 'Activo' : 'Inactivo'}
          size="small"
          color={questionnaire.active ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Ver / editar contenido">
          <Link to="/cuestionarios/$id" params={{ id: String(questionnaire.id) }}>
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
