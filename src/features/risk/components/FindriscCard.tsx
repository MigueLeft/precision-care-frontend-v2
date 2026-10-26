import { Chip, Paper, Stack, Typography } from '@mui/material'
import type { FindriscResult } from '../types'
import { FINDRISC_CATEGORY_COLORS, FINDRISC_CATEGORY_LABELS, FINDRISC_ITEM_LABELS } from '../utils/risk-labels'
import { WarningList } from './WarningList'

const show = (value: number | boolean | string | null) =>
  value === null ? '—' : value === true ? 'Sí' : value === false ? 'No' : String(value)

// FINDRISC: puntaje, categoría y puntos por ítem (o intervalo si faltan datos).
export function FindriscCard({ result }: { result: FindriscResult }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>
        FINDRISC · riesgo de diabetes tipo 2 a 10 años
      </Typography>
      {result.status === 'not_applicable' ? (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>No aplica: {result.reason}</Typography>
      ) : (
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '22px', fontWeight: 700 }}>
              {result.status === 'complete' ? result.score : `${result.range[0]}–${result.range[1]}`}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>/ 26</Typography>
            {result.category ? (
              <Chip size="small" color={FINDRISC_CATEGORY_COLORS[result.category]} label={FINDRISC_CATEGORY_LABELS[result.category]} />
            ) : (
              <Chip size="small" variant="outlined" label="Incompleto" />
            )}
            <Typography sx={{ fontSize: '11px', color: 'text.secondary', ml: 'auto !important' }}>
              {result.variant === 'LA' ? 'LA-FINDRISC' : 'FINDRISC original'}
            </Typography>
          </Stack>
          <Stack spacing={0.25}>
            {result.items.map((item) => (
              <Stack key={item.item} direction="row" sx={{ fontSize: '12.5px' }}>
                <Typography sx={{ fontSize: '12.5px', flex: 1 }}>{FINDRISC_ITEM_LABELS[item.item] ?? item.item}</Typography>
                <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', mr: 2 }}>{show(item.value)}</Typography>
                <Typography sx={{ fontSize: '12.5px', fontWeight: 600, minWidth: 48, textAlign: 'right' }}>
                  {item.points === null ? `${item.min}–${item.max}` : `${item.points} pts`}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <WarningList warnings={result.warnings} />
        </Stack>
      )}
    </Paper>
  )
}
