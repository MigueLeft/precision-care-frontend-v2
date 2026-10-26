import { Paper, Stack, Typography } from '@mui/material'
import type { GloboriskAssessment } from '../types'
import { WarningList } from './WarningList'

const VERSION_LABELS = { lab: 'laboratorio', office: 'consultorio', fatal: 'fatal' } as const

// Globorisk: riesgo CV a 10 años (fatal + no fatal) con la versión usada y el año base.
export function GloboriskCard({ result }: { result: GloboriskAssessment }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>
        Globorisk · riesgo cardiovascular a 10 años
      </Typography>
      {result.status === 'calculated' ? (
        <Stack spacing={1}>
          <Typography sx={{ fontSize: '22px', fontWeight: 700 }}>{(result.risk * 100).toFixed(1)} %</Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            Versión {VERSION_LABELS[result.version]} · coeficientes {result.coefficients === 'lac' ? 'LAC' : 'originales'} ·
            año base {result.baseYear} · Venezuela
          </Typography>
          <WarningList warnings={result.warnings} />
        </Stack>
      ) : (
        <Stack spacing={1}>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            {result.status === 'not_applicable' ? 'No aplica' : 'No calculado'}: {result.reason}
          </Typography>
          <WarningList warnings={result.warnings} />
        </Stack>
      )}
    </Paper>
  )
}
