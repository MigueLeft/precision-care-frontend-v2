import { Box, Stack, Typography } from '@mui/material'
import { usePatient } from '@/features/patients'
import { useConsultation } from '../../hooks/useConsultationDetail'
import { EncounterHeader } from './EncounterHeader'
import { EncounterPatientBar } from './EncounterPatientBar'
import { EncounterSidebar } from './EncounterSidebar'
import { EncounterMainSections } from './EncounterMainSections'
import { PlaceholderSection } from './PlaceholderSection'
import { ProblemsSection } from './ProblemsSection'
import { StudyPlanSection } from './StudyPlanSection'
import { LifeEssential8Section } from './LifeEssential8Section'

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
          <GroupTitle>CONTENIDO PRINCIPAL</GroupTitle>
          <EncounterMainSections consultation={consultation} readOnly={readOnly} />

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
            <StudyPlanSection index={1} consultation={consultation} readOnly={readOnly} />
            <ProblemsSection index={2} consultation={consultation} readOnly={readOnly} />
            <PlaceholderSection index={3} title="Prescripciones" />
          </Stack>
        </Box>

        <EncounterSidebar consultation={consultation} readOnly={readOnly} />
      </Stack>
    </Box>
  )
}
