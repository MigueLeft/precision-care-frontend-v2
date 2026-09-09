import { Box, Chip, Stack, Typography } from '@mui/material'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import {
  formatPatientName,
  formatPatientInitials,
  calculatePatientAge,
  formatBirthDate,
  usePatientAllergies,
  allergySeverityColor,
  formatAllergyLabel,
  type Patient,
} from '@/features/patients'
import { useCountries } from '@/features/catalogs'
import { useConsultationsByPatient } from '@/features/consultations'
import { MedicalRecordHeaderActions } from './MedicalRecordHeaderActions'

interface MedicalRecordHeaderProps {
  patient: Patient
}

export function MedicalRecordHeader({ patient }: MedicalRecordHeaderProps) {
  const { data: countries = [] } = useCountries()
  const { data: allergies = [] } = usePatientAllergies(patient.id)
  const { data: consultations = [] } = useConsultationsByPatient(patient.id)

  const countryNameById = new Map(countries.map((c) => [c.id, c.name]))
  const nationality = patient.nationalityCountryId
    ? countryNameById.get(patient.nationalityCountryId)
    : undefined
  const residence = patient.residenceCountryId
    ? countryNameById.get(patient.residenceCountryId)
    : undefined
  // Especialista de referencia: el de la consulta más reciente.
  const primarySpecialist = consultations.find((c) => c.specialistName)?.specialistName

  const identityLine = [
    `${calculatePatientAge(patient.birthDate)} años`,
    formatBirthDate(patient.birthDate),
  ].join(' · ')
  const locationLine = [nationality, residence].filter(Boolean).join(' · ')

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 3, mb: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={2} sx={{ minWidth: 0 }}>
          <InitialsAvatar initials={formatPatientInitials(patient)} size={52} />
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h1">{formatPatientName(patient)}</Typography>
              <Chip label={patient.mrn} size="small" variant="outlined" />
            </Stack>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 0.5 }}>
              {identityLine}
              {locationLine && `  |  ${locationLine}`}
              {primarySpecialist && `  |  ${primarySpecialist}`}
            </Typography>
          </Box>
        </Stack>
        <MedicalRecordHeaderActions />
      </Stack>

      {allergies.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap', mt: 2 }}
        >
          {allergies.map((allergy) => (
            <Chip
              key={allergy.id}
              icon={<WarningAmberOutlinedIcon sx={{ fontSize: 14 }} />}
              label={formatAllergyLabel(allergy)}
              size="small"
              color={allergySeverityColor(allergy.severityName)}
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}
