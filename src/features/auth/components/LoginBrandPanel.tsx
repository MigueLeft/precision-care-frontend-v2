import { Box, Stack, Typography } from '@mui/material'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'

const FEATURES = [
  'Gestión centralizada de pacientes y especialistas',
  'Historial clínico digital con trazabilidad completa',
  'Consultas, citas y entregables en tiempo real',
]

export function LoginBrandPanel() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #001d4a 0%, #046ea3 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 6,
        minHeight: '100vh',
      }}
    >
      {/* Círculos decorativos */}
      <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(0,204,204,0.12)' }} />
      <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(0,204,204,0.22)' }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: -60, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(0,204,204,0.04)', border: '1px solid rgba(0,204,204,0.1)' }} />
      <Box sx={{ position: 'absolute', bottom: 120, right: -30, width: 140, height: 140, borderRadius: '50%', border: '1px solid rgba(185,214,242,0.1)' }} />

      {/* Logo */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: '8px',
            bgcolor: 'rgba(0,204,204,0.15)',
            border: '1px solid rgba(0,204,204,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <MedicalServicesIcon sx={{ color: '#00cccc', fontSize: 20 }} />
        </Box>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '0.02em', fontFamily: "'Montserrat', sans-serif" }}>
          Precision Care
        </Typography>
      </Stack>

      {/* Contenido principal */}
      <Box>
        <Typography
          sx={{
            color: '#fff', fontSize: '32px', fontWeight: 700,
            mb: 2, lineHeight: 1.25, fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Gestión médica{' '}
          <Box component="span" sx={{ color: '#00cccc' }}>inteligente</Box>
        </Typography>

        <Typography sx={{ color: '#b9d6f2', fontSize: '15px', mb: 5, lineHeight: 1.7, fontFamily: "'Montserrat', sans-serif" }}>
          Una plataforma integral para especialistas,<br />pacientes y administradores médicos.
        </Typography>

        <Stack spacing={2.5}>
          {FEATURES.map((feat) => (
            <Stack key={feat} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <CheckCircleOutlinedIcon sx={{ color: '#00cccc', fontSize: 18, mt: '2px', flexShrink: 0 }} />
              <Typography sx={{ color: '#b9d6f2', fontSize: '14px', lineHeight: 1.6, fontFamily: "'Montserrat', sans-serif" }}>
                {feat}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Footer */}
      <Typography sx={{ color: 'rgba(185,214,242,0.45)', fontSize: '12px', fontFamily: "'Montserrat', sans-serif" }}>
        © 2026 Precision Care · Todos los derechos reservados
      </Typography>
    </Box>
  )
}
