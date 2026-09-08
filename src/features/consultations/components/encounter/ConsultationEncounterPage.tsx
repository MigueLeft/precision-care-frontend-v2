import { Box, Stack, Typography } from '@mui/material'
import { usePatient } from '@/features/patients'
import { useConsultation, useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { EncounterHeader } from './EncounterHeader'
import { EncounterPatientBar } from './EncounterPatientBar'
import { EncounterSidebar } from './EncounterSidebar'
import { SymptomsSection } from './SymptomsSection'
import { PlaceholderSection } from './PlaceholderSection'
import { AutosaveTextField } from './AutosaveTextField'

interface ConsultationEncounterPageProps {
  consultationId: number
}

function GroupTitle({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: 'text.secondary',
        mt: 3,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  )
}

export function ConsultationEncounterPage({ consultationId }: ConsultationEncounterPageProps) {
  const { data: consultation } = useConsultation(consultationId)
  const { data: patient } = usePatient(consultation?.patientId)
  const update = useUpdateConsultation(consultationId)

  if (!consultation) return null

  const readOnly = consultation.status === 'completed'

  return (
    <Box sx={{ mx: -4, mt: -4 }}>
      <EncounterHeader consultation={consultation} readOnly={readOnly} />
      {patient && <EncounterPatientBar patient={patient} />}

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        sx={{ p: 4, alignItems: 'flex-start' }}
      >
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>
            Motivo de consulta
          </Typography>
          <AutosaveTextField
            value={consultation.consultationReason ?? ''}
            onSave={(consultationReason) => update.mutate({ consultationReason })}
            disabled={readOnly}
            minRows={2}
          />

          <GroupTitle>PARTE MÉDICA</GroupTitle>
          <Stack spacing={1.5}>
            <SymptomsSection
              index={1}
              consultationId={consultationId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <PlaceholderSection index={2} title="Alergias" subtitle="Valida prescripciones" />
            <PlaceholderSection
              index={3}
              title="Enfermedades / diagnósticos"
              subtitle="Agrupados por aparato o sistema"
            />
            <PlaceholderSection
              index={4}
              title="Tratamiento actual"
              subtitle="Texto libre · adherencia y RAM"
            />
            <PlaceholderSection
              index={5}
              title="Composición corporal"
              subtitle="Datos generales y segmentos"
            />
            <PlaceholderSection
              index={6}
              title="Examen físico"
              subtitle="Parámetros e índices calculados"
            />
            <PlaceholderSection
              index={7}
              title="Paraclínicos"
              subtitle="Laboratorio, imagen, cardiología"
            />
          </Stack>

          <GroupTitle>PARTE DE ESTILO DE VIDA</GroupTitle>
          <Stack spacing={1.5}>
            <PlaceholderSection
              index={1}
              title="Nutrición"
              subtitle="Respuestas de ingreso · asignación de plan"
            />
            <PlaceholderSection
              index={2}
              title="Life's Essential 8"
              subtitle="Puntaje de salud cardiovascular"
            />
          </Stack>

          <GroupTitle>CIERRE CLÍNICO</GroupTitle>
          <Stack spacing={1.5}>
            <PlaceholderSection index={1} title="Diagnósticos" />
            <PlaceholderSection index={2} title="Prescripciones" />
          </Stack>
        </Box>

        <EncounterSidebar consultation={consultation} readOnly={readOnly} />
      </Stack>
    </Box>
  )
}
