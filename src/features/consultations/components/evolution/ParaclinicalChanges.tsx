import { Stack, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import { NoteBlock } from '../note/NoteBlock'
import type { ParaclinicalEvolution } from '../../types/evolution'

// Paraclínicos con resultado nuevo o distinto desde la consulta anterior.
export function ParaclinicalChanges({ items }: { items: ParaclinicalEvolution[] }) {
  return (
    <NoteBlock title="PARACLÍNICOS">
      {items.length === 0 ? (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
          Sin resultados nuevos ni cambios.
        </Typography>
      ) : (
        <Stack spacing={0.5}>
          {items.map((item) => (
            <Stack
              key={item.paraclinicalCatalogId}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'baseline' }}
            >
              <Typography sx={{ fontSize: '13px', flex: 1, minWidth: 0 }}>{item.name}</Typography>
              <Typography sx={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                {item.before ? `${item.before.value} → ` : 'Nuevo: '}
                <strong>{item.after.value}</strong> {item.unit ?? ''}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary', minWidth: 72, textAlign: 'right' }}>
                {formatShortDate(item.after.date)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </NoteBlock>
  )
}
