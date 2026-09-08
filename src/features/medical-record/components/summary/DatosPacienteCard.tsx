import { Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import {
  calculatePatientAge,
  formatBirthDate,
  type Patient,
} from '@/features/patients'
import { useCivilStatuses, useSocioeconomicLevels } from '@/features/catalogs'

interface DatosPacienteCardProps {
  patient: Patient
}

interface RowProps {
  label: string
  value: string
}

function Row({ label, value }: RowProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  )
}

export function DatosPacienteCard({ patient }: DatosPacienteCardProps) {
  const { data: civilStatuses = [] } = useCivilStatuses()
  const { data: socioeconomicLevels = [] } = useSocioeconomicLevels()

  const civilStatus = patient.civilStatusId
    ? civilStatuses.find((c) => c.id === patient.civilStatusId)?.name
    : undefined
  const socioeconomicLevel = patient.socioeconomicLevelId
    ? socioeconomicLevels.find((s) => s.id === patient.socioeconomicLevelId)?.name
    : undefined

  return (
    <SectionCard title="Datos del paciente">
      <Stack spacing={1.5}>
        <Row
          label="Fecha de nacimiento"
          value={`${formatBirthDate(patient.birthDate)} (${calculatePatientAge(patient.birthDate)} años)`}
        />
        <Row label="Estado civil" value={civilStatus ?? '—'} />
        <Row label="Nivel socioeconómico" value={socioeconomicLevel ?? '—'} />
        <Row label="Email" value={patient.email ?? '—'} />
      </Stack>
    </SectionCard>
  )
}
