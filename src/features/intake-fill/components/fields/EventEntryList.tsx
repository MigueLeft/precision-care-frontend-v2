import { IconButton, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import type { IntakeEventEntry } from '../../types'

type EventEntryListProps = {
  entries: IntakeEventEntry[]
  onRemove: (index: number) => void
}

// "2015-06-10" → "10/06/2015" y "2015-06" → "06/2015" sin pasar por Date
// (evita el desfase por zona horaria).
function formatEntryDate(date: string): string {
  return date.split('-').reverse().join('/')
}

// Eventos (cirugías u hospitalizaciones) ya añadidos por el paciente.
export function EventEntryList({ entries, onRemove }: EventEntryListProps) {
  if (entries.length === 0) {
    return (
      <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
        Aún no has añadido registros.
      </Typography>
    )
  }

  return (
    <Stack spacing={1}>
      {entries.map((entry, index) => (
        <Stack
          key={`${entry.name}-${index}`}
          direction="row"
          spacing={1}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{entry.name}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {[
                entry.date ? formatEntryDate(entry.date) : null,
                entry.complications ? `Complicaciones: ${entry.complications}` : null,
              ]
                .filter(Boolean)
                .join(' · ') || 'Sin fecha'}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={() => onRemove(index)} aria-label="Quitar">
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  )
}
