import { Box, Stack, Typography } from '@mui/material'
import { usePatient } from '@/features/patients'
import { useConsultation, useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { EncounterHeader } from './EncounterHeader'
import { EncounterPatientBar } from './EncounterPatientBar'
import { EncounterSidebar } from './EncounterSidebar'
import { SymptomsSection } from './SymptomsSection'
import { AllergiesSection } from './AllergiesSection'
import { DiseasesSection } from './DiseasesSection'
import { TreatmentSection } from './TreatmentSection'
import { PhysicalExamSection } from '@/features/physical-exam'
import { BodyCompositionSection } from '@/features/body-composition'
import { PlaceholderSection } from './PlaceholderSection'
import { ProblemsSection } from './ProblemsSection'
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
            <AllergiesSection
              index={2}
              consultationId={consultationId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <DiseasesSection
              index={3}
              consultationId={consultationId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <TreatmentSection index={4} consultation={consultation} readOnly={readOnly} />
            <BodyCompositionSection
              index={5}
              consultationId={consultationId}
              patientId={consultation.patientId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <PhysicalExamSection
              index={6}
              consultationId={consultationId}
              patientId={consultation.patientId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
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
            <ProblemsSection consultation={consultation} readOnly={readOnly} />
            <PlaceholderSection index={2} title="Prescripciones" />
          </Stack>
        </Box>

        <EncounterSidebar consultation={consultation} readOnly={readOnly} />
      </Stack>
    </Box>
  )
}
