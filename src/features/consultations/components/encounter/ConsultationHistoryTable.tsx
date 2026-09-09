import { useState, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import { formatShortDate } from '@/utils/format-date'

export interface HistoryEntry {
  consultationId: number
  date: string
  specialistName: string | null
  /** Contenido de la consulta previa: texto + chips que arma cada dominio. */
  content: ReactNode
}

interface ConsultationHistoryTableProps {
  entries: HistoryEntry[]
  /** Texto del contador; por defecto "N consultas anteriores". */
  countLabel?: (count: number) => string
  defaultExpanded?: boolean
}

const defaultCountLabel = (n: number) =>
  `${n} ${n === 1 ? 'consulta anterior' : 'consultas anteriores'}`

// Histórico de una sección de la consulta en formato tabla: fecha + especialista
// a la izquierda, contenido a la derecha (una fila por consulta previa).
export function ConsultationHistoryTable({
  entries,
  countLabel = defaultCountLabel,
  defaultExpanded = false,
}: ConsultationHistoryTableProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  if (entries.length === 0) return null

  return (
    <Box
      sx={{
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.25,
          bgcolor: '#f8fafc',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.secondary' }}>
            Histórico · {countLabel(entries.length)}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600 }}>
          {expanded ? 'Ocultar' : 'Ver'}
        </Typography>
      </Stack>

      {expanded &&
        entries.map((entry, index) => (
          <Stack
            key={entry.consultationId}
            direction="row"
            spacing={2}
            sx={{
              px: 2,
              py: 1.5,
              borderTop: index === 0 ? 'none' : '1px solid',
              borderColor: 'divider',
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ width: 96, flexShrink: 0 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>
                {formatShortDate(entry.date)}
              </Typography>
              {entry.specialistName && (
                <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                  {entry.specialistName}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>{entry.content}</Box>
          </Stack>
        ))}
    </Box>
  )
}
