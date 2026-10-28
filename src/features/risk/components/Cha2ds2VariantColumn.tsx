import { Chip, Stack, Typography } from '@mui/material'
import type { Cha2ds2VariantResult } from '../types'
import { CHA2DS2_ITEM_LABELS, RECOMMENDATION_COLORS, RECOMMENDATION_LABELS } from '../utils/cardio-labels'
import { WarningList } from './WarningList'

const TITLES = { vasc: 'CHA₂DS₂-VASc', va: 'CHA₂DS₂-VA' } as const

type Cha2ds2VariantColumnProps = {
  result: Cha2ds2VariantResult
  primary: boolean
}

// Una variante: puntaje (o intervalo si falta un dato), ítems que suman,
// recomendación según su guía y tasa anual de ACV si la política la trae.
export function Cha2ds2VariantColumn({ result, primary }: Cha2ds2VariantColumnProps) {
  const scoring = result.items.filter((item) => item.points !== 0)
  return (
    <Stack spacing={0.75}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{TITLES[result.variant]}</Typography>
        {primary && <Chip size="small" color="primary" label="Principal" />}
      </Stack>
      <Typography sx={{ fontSize: '22px', fontWeight: 700 }}>
        {result.status === 'complete' ? `${result.score} pts` : `${result.range[0]}–${result.range[1]} pts`}
      </Typography>
      {result.status === 'incomplete' && (
        <Typography sx={{ fontSize: '12px', color: 'warning.main' }}>Incompleto: faltan datos para el puntaje final.</Typography>
      )}
      {result.recommendation && (
        <Chip
          size="small"
          sx={{ alignSelf: 'flex-start' }}
          label={RECOMMENDATION_LABELS[result.recommendation]}
          color={RECOMMENDATION_COLORS[result.recommendation]}
        />
      )}
      <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
        {result.guideline}
        {result.annualStrokeRatePct !== null ? ` · ACV ≈ ${result.annualStrokeRatePct} %/año` : ''}
      </Typography>
      <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap' }}>
        {scoring.map((item) => (
          <Chip
            key={item.item}
            size="small"
            variant="outlined"
            label={`${CHA2DS2_ITEM_LABELS[item.item]} ${item.points === null ? `(${item.min}–${item.max})` : `+${item.points}`}`}
          />
        ))}
        {scoring.length === 0 && <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Sin factores que sumen.</Typography>}
      </Stack>
      <WarningList warnings={result.warnings} />
    </Stack>
  )
}
