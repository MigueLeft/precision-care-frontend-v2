import { Box, Stack, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined'
import type { Question } from '../types'

const TYPE_LABELS: Record<Question['type'], string> = {
  single_choice: 'Opción única',
  multiple_choice: 'Opción múltiple',
  scale: 'Escala',
  free_text: 'Texto libre',
  numeric: 'Numérico',
  date: 'Fecha',
  boolean: 'Sí/No',
}

interface QuestionRowProps {
  question: Question
  readOnly: boolean
  onEdit: () => void
  onDelete: () => void
  onConfigureMapping: () => void
}

export function QuestionRow({ question, readOnly, onEdit, onDelete, onConfigureMapping }: QuestionRowProps) {
  return (
    <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'grey.50' }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{question.text}</Typography>
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
            <Chip label={TYPE_LABELS[question.type]} size="small" />
            {question.required && <Chip label="Obligatoria" size="small" color="warning" />}
            {question.options.length > 0 && (
              <Chip label={`${question.options.length} opciones`} size="small" variant="outlined" />
            )}
          </Stack>
        </Box>

        {!readOnly && (
          <Stack direction="row">
            <Tooltip title="Configurar mapeo">
              <IconButton size="small" onClick={onConfigureMapping} aria-label="Configurar mapeo de la pregunta">
                <AltRouteOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar pregunta">
              <IconButton size="small" onClick={onEdit} aria-label="Editar pregunta">
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar pregunta">
              <IconButton size="small" onClick={onDelete} aria-label="Eliminar pregunta">
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
