import { Box, LinearProgress } from '@mui/material'

// Fallback mientras una ruta espera su loader o su chunk de código. Se muestra
// casi de inmediato (ver `defaultPendingMs` en router.ts) para que el cambio de
// página se sienta instantáneo aunque los datos aún estén en camino.
export function RoutePending() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress sx={{ height: 3, borderRadius: '2px' }} />
    </Box>
  )
}
