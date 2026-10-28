import { Box, Stack, Typography } from '@mui/material'
import { SectionDensityContext } from '@/components/ui/section-density'
import { DraftConsultationContext } from '@/hooks/draft-consultation'
import { usePatient } from '@/features/patients'
import { useMe } from '@/features/identity'
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
        mt: 2,
        mb: 0.75,
      }}
    >
      {children}
    </Typography>
  )
}

export function ConsultationEncounterPage({ consultationId }: ConsultationEncounterPageProps) {
  const { data: consultation } = useConsultation(consultationId)
  const { data: patient } = usePatient(consultation?.patientId)
  const { data: me } = useMe()

  if (!consultation) return null

  // Otro especialista (con permiso para ver todas) solo puede consultarla.
  const isOtherSpecialist =
    me?.specialistId != null && me.specialistId !== consultation.specialistId
  const readOnly = consultation.status === 'completed' || isOtherSpecialist

  return (
    // Lo capturado aquí es borrador de la consulta hasta finalizarla.
    <DraftConsultationContext.Provider value={consultation.id}>
    <Box sx={{ mx: -4, mt: -4 }}>
      <EncounterHeader consultation={consultation} readOnly={readOnly} />
      {patient && <EncounterPatientBar patient={patient} />}

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        sx={{ p: 4, alignItems: 'flex-start' }}
      >
        {/* Apartados compactos: la consulta tiene muchas secciones. */}
        <SectionDensityContext.Provider value="compact">
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <GroupTitle>CONTENIDO PRINCIPAL</GroupTitle>
            <EncounterMainSections consultation={consultation} readOnly={readOnly} />

            <GroupTitle>PARTE DE ESTILO DE VIDA</GroupTitle>
            <Stack spacing={1}>
              <PlaceholderSection
                index={1}
                title="Nutrición"
                subtitle="Respuestas de ingreso · asignación de plan"
              />
              <LifeEssential8Section
                index={2}
                consultationId={consultation.id}
                patientId={consultation.patientId}
                readOnly={readOnly}
              />
            </Stack>

            <GroupTitle>CIERRE CLÍNICO</GroupTitle>
            <Stack spacing={1}>
              <StudyPlanSection index={1} consultation={consultation} readOnly={readOnly} />
              <ProblemsSection index={2} consultation={consultation} readOnly={readOnly} />
              <PlaceholderSection index={3} title="Prescripciones" />
            </Stack>
          </Box>
        </SectionDensityContext.Provider>

        <EncounterSidebar consultation={consultation} readOnly={readOnly} />
      </Stack>
    </Box>
    </DraftConsultationContext.Provider>
  )
}
