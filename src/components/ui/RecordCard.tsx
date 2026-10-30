import type { ReactNode } from 'react'
import { IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

type RecordCardProps = {
  title: string
  // Línea secundaria bajo el título (código, parentesco…).
  subtitle?: string | null
  // Chips de estado, severidad, etc.
  chips?: ReactNode
  // Detalle adicional (notas, diagnósticos asociados…).
  children?: ReactNode
  selected?: boolean
  highlight?: 'error'
  onEdit?: () => void
  onRemove?: () => void
}

// Tarjeta de un registro clínico en una lista (síntoma, diagnóstico, antecedente).
export function RecordCard({ title, subtitle, chips, children, selected, highlight, onEdit, onRemove }: RecordCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: '8px',
        borderColor: selected ? 'primary.main' : highlight === 'error' ? 'error.light' : 'divider',
        boxShadow: selected ? (theme) => `0 0 0 1px ${theme.palette.primary.main}` : 'none',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: highlight === 'error' ? 'error.main' : 'text.primary' }}>
            {title}
          </Typography>
          {subtitle && <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{subtitle}</Typography>}
        </Stack>
        {onEdit && (
          <Tooltip title="Editar">
            <IconButton size="small" aria-label={`Editar ${title}`} onClick={onEdit}>
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
        {onRemove && (
          <Tooltip title="Quitar">
            <IconButton size="small" aria-label={`Quitar ${title}`} onClick={onRemove}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      {chips && (
        <Stack direction="row" spacing={0.75} useFlexGap sx={{ mt: 1, flexWrap: 'wrap' }}>
          {chips}
        </Stack>
      )}
      {children}
    </Paper>
  )
}
