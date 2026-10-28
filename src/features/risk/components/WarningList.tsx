import { Alert, Stack } from '@mui/material'
import type { EngineWarning } from '../types'

// Advertencias de un cálculo (datos faltantes, versión usada, plausibilidad…).
export function WarningList({ warnings }: { warnings: EngineWarning[] }) {
  if (warnings.length === 0) return null
  return (
    <Stack spacing={0.5}>
      {warnings.map((w, index) => (
        <Alert key={`${w.code}-${index}`} severity="warning" sx={{ py: 0, '& .MuiAlert-message': { fontSize: '12px' } }}>
          {w.message}
        </Alert>
      ))}
    </Stack>
  )
}
