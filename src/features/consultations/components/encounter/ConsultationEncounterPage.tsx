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
import { AntecedentsSection } from './AntecedentsSection'
import { ParaclinicalSection } from './ParaclinicalSection'
import { LifeEssential8Section } from './LifeEssential8Section'
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
            <AntecedentsSection index={1} patientId={consultation.patientId} readOnly={readOnly} />
            <SymptomsSection
              index={2}
              consultationId={consultationId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <AllergiesSection
              index={3}
              consultationId={consultationId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <DiseasesSection
              index={4}
              consultationId={consultationId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <TreatmentSection index={5} consultation={consultation} readOnly={readOnly} />
            <BodyCompositionSection
              index={6}
              consultationId={consultationId}
              patientId={consultation.patientId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <PhysicalExamSection
              index={7}
              consultationId={consultationId}
              patientId={consultation.patientId}
              consultationDate={consultation.startAt}
              readOnly={readOnly}
            />
            <ParaclinicalSection
              index={8}
              patientId={consultation.patientId}
              readOnly={readOnly}
            />
          </Stack>

          <GroupTitle>PARTE DE ESTILO DE VIDA</GroupTitle>
          <Stack spacing={1.5}>
            <PlaceholderSection
              index={1}
              title="Nutrición"
              subtitle="Respuestas de ingreso · asignación de plan"
            />
            <LifeEssential8Section index={2} patientId={consultation.patientId} />
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
