import { Divider, Paper, Stack, Typography } from '@mui/material'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useStrokePreventionAf } from '../hooks/useRisk'
import { Cha2ds2VariantColumn } from './Cha2ds2VariantColumn'
import { WarningList } from './WarningList'

// Prevención del ACV en fibrilación auricular (no es prevención primaria): se
// muestra solo si el paciente tiene FA (I48) registrada o confirmada.
export function Cha2ds2Card({ patientId }: { patientId: number }) {
  const { data, isLoading, isError, error } = useStrokePreventionAf(patientId, true)

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>
        Fibrilación auricular · riesgo de ACV (CHA₂DS₂)
      </Typography>
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {data?.status === 'not_applicable' && (
          <Stack spacing={1}>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>No aplica: {data.reason}</Typography>
            <WarningList warnings={data.warnings} />
          </Stack>
        )}
        {data?.status === 'evaluated' && (
          <Stack spacing={1.5}>
            <WarningList warnings={data.warnings} />
            {/* La principal arriba y la otra variante debajo, a todo el ancho. */}
            <Stack spacing={1.5} divider={<Divider flexItem />}>
              {(data.primaryVariant === 'vasc' ? (['vasc', 'va'] as const) : (['va', 'vasc'] as const)).map((variant) => (
                <Cha2ds2VariantColumn key={variant} result={data[variant]} primary={data.primaryVariant === variant} />
              ))}
            </Stack>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontStyle: 'italic' }}>{data.legend}</Typography>
          </Stack>
        )}
      </QueryBoundary>
    </Paper>
  )
}
