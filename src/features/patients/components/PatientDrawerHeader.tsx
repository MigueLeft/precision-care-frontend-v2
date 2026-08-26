import { Box, Stack, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import { formatPatientName, formatPatientInitials, calculatePatientAge } from '../utils/patient-format'
import type { Patient } from '../types'

interface PatientDrawerHeaderProps {
  patient: Patient
  onClose: () => void
}

export function PatientDrawerHeader({ patient, onClose }: PatientDrawerHeaderProps) {
  return (
    <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', p: 3, pb: 2 }}>
      <Stack direction="row" spacing={2}>
        <InitialsAvatar initials={formatPatientInitials(patient)} size={48} />
        <Box>
          <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.05em' }}>
            VISTA RÁPIDA
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'brand.dark' }}>
            {formatPatientName(patient)}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {patient.mrn} · {calculatePatientAge(patient.birthDate)} años
          </Typography>
        </Box>
      </Stack>
      <IconButton size="small" onClick={onClose} aria-label="Cerrar">
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Stack>
  )
}
