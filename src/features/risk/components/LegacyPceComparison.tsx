import { useState } from 'react'
import { Chip, CircularProgress, Stack, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useLegacyPce } from '../hooks/useRisk'
import { ASCVD_CATEGORY_COLORS, ASCVD_CATEGORY_LABELS, percent, splitNotes } from '../utils/cardio-labels'
import { WarningList } from './WarningList'

// PCE (Goff 2013) solo a pedido: comparativo heredado, nunca el resultado principal.
export function LegacyPceComparison({ patientId }: { patientId: number }) {
  const [requested, setRequested] = useState(false)
  const { data: pce, isFetching } = useLegacyPce(patientId, requested)

  if (!requested) {
    return (
      <AppButton size="small" variant="text" sx={{ alignSelf: 'flex-start' }} onClick={() => setRequested(true)}>
        Comparar con PCE (Goff 2013, heredada)
      </AppButton>
    )
  }
  if (isFetching && !pce) return <CircularProgress size={18} />
  if (!pce) return null
  const { warnings, notes } = splitNotes(pce.warnings)

  return (
    <Stack spacing={0.75} sx={{ borderTop: 1, borderColor: 'divider', pt: 1 }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>PCE (Goff 2013) · ASCVD a 10 años</Typography>
      {pce.status === 'calculated' ? (
        <>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>{percent(pce.ascvd10yr)}</Typography>
            <Chip size="small" label={ASCVD_CATEGORY_LABELS[pce.category]} color={ASCVD_CATEGORY_COLORS[pce.category]} />
          </Stack>
          <WarningList warnings={warnings} />
          <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>{notes.join(' ')}</Typography>
        </>
      ) : (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{pce.reason}</Typography>
      )}
    </Stack>
  )
}
