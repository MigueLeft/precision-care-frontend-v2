import { Chip, Paper, Stack, Typography } from '@mui/material'
import type { RiskProfileResult } from '../types'
import { FACTOR_LABELS, PROFILE_FIELD_LABELS, SEVERITY_COLORS, SEVERITY_LABELS } from '../utils/risk-labels'

// Hallazgos del perfil de factores de riesgo y datos faltantes o vencidos.
export function RiskFindings({ result }: { result: RiskProfileResult }) {
  const missing = result.gaps.filter((g) => g.reason === 'missing')
  const expired = result.gaps.filter((g) => g.reason === 'expired')
  const names = (gaps: typeof result.gaps) => gaps.map((g) => PROFILE_FIELD_LABELS[g.field] ?? g.field).join(', ')

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
      <Stack direction="row" sx={{ alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700, flex: 1 }}>Perfil de factores de riesgo</Typography>
        <Chip size="small" variant="outlined" color={result.majorAltered ? 'error' : 'default'} label={`${result.majorAltered} mayores alterados`} />
      </Stack>
      {result.findings.length === 0 && (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Sin datos suficientes para evaluar.</Typography>
      )}
      <Stack spacing={0.5}>
        {result.findings.map((f) => (
          <Stack key={f.factor} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip size="small" color={SEVERITY_COLORS[f.severity]} variant={f.severity === 'normal' ? 'outlined' : 'filled'} label={SEVERITY_LABELS[f.severity]} sx={{ minWidth: 76 }} />
            <Typography sx={{ fontSize: '12.5px', fontWeight: 600, minWidth: 140 }}>{FACTOR_LABELS[f.factor] ?? f.factor}</Typography>
            <Typography sx={{ fontSize: '12.5px', minWidth: 90 }}>{f.value}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary', flex: 1 }}>
              {f.rule}
              {f.action ? ` · ${f.action}` : ''}
            </Typography>
          </Stack>
        ))}
      </Stack>
      {(missing.length > 0 || expired.length > 0) && (
        <Typography sx={{ fontSize: '12px', color: 'warning.dark', mt: 1 }}>
          {missing.length > 0 && <>Faltan: {names(missing)}. </>}
          {expired.length > 0 && <>Vencidos (solicitar de nuevo): {names(expired)}.</>}
        </Typography>
      )}
    </Paper>
  )
}
