import { Box, Stack, Typography, Divider } from '@mui/material'
import { formatBirthDate, calculatePatientAge } from '../utils/patient-format'
import type { Patient } from '../types'

interface PatientDrawerInfoProps {
  patient: Patient
  countryNameById: Map<number, string>
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', py: 1 }}>
      <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>{value}</Typography>
    </Stack>
  )
}

export function PatientDrawerInfo({ patient, countryNameById }: PatientDrawerInfoProps) {
  const nationalityName = patient.nationalityCountryId
    ? countryNameById.get(patient.nationalityCountryId)
    : undefined
  const residenceName = patient.residenceCountryId
    ? countryNameById.get(patient.residenceCountryId)
    : undefined

  return (
    <Box sx={{ px: 3 }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'brand.dark', mb: 0.5 }}>
        Demografía
      </Typography>
      <InfoRow
        label="Fecha de nacimiento"
        value={`${formatBirthDate(patient.birthDate)} (${calculatePatientAge(patient.birthDate)} años)`}
      />
      <InfoRow label="Nacionalidad" value={nationalityName ?? '—'} />
      <InfoRow label="Residencia" value={residenceName ?? '—'} />

      <Divider sx={{ my: 2 }} />

      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'brand.dark', mb: 0.5 }}>
        Contacto
      </Typography>
      <InfoRow label="Email" value={patient.email ?? '—'} />
    </Box>
  )
}
