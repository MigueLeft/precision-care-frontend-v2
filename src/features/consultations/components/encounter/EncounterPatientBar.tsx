import type { ReactNode } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import {
  calculatePatientAge,
  formatPatientInitials,
  formatPatientName,
  usePatientAllergies,
  formatAllergyLabel,
  isSevereAllergy,
  type Patient,
} from '@/features/patients'

interface EncounterPatientBarProps {
  patient: Patient
  // Acción al extremo izquierdo, antes del paciente (Finalizar consulta).
  startAction?: ReactNode
  // Contenido al extremo derecho (duración de la consulta).
  endAction?: ReactNode
}

export function EncounterPatientBar({ patient, startAction, endAction }: EncounterPatientBarProps) {
  const { data: allergies = [] } = usePatientAllergies(patient.id)
  // En la barra del paciente solo se muestran las alergias severas.
  const severeAllergies = allergies.filter(isSevereAllergy)

  return (
    <Box sx={{ bgcolor: 'brand.dark', color: '#fff', px: 3, py: 1.5 }}>
      <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {startAction}
        <InitialsAvatar initials={formatPatientInitials(patient)} size={36} />
        <Typography sx={{ fontSize: '15px', fontWeight: 700 }}>
          {formatPatientName(patient)}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
          {patient.mrn} · {calculatePatientAge(patient.birthDate)} años
        </Typography>
        {severeAllergies.map((allergy) => (
          <Chip
            key={allergy.id}
            icon={<WarningAmberOutlinedIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
            label={formatAllergyLabel(allergy)}
            size="small"
            sx={{ bgcolor: 'error.main', color: '#fff' }}
          />
        ))}
        {endAction && <Box sx={{ ml: 'auto' }}>{endAction}</Box>}
      </Stack>
    </Box>
  )
}
