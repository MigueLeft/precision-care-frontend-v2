import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AppButton } from '@/components/AppButton'
import { IntakeResponseDetailContent } from '@/features/intake-responses'
import { AutosaveTextField } from './AutosaveTextField'
import { GenerarEntregablesPanel } from './GenerarEntregablesPanel'
import { IntakeResponsesSection } from './IntakeResponsesSection'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import type { Consultation } from '../../types'

interface EncounterSidebarProps {
  consultation: Consultation
  readOnly: boolean
}

export function EncounterSidebar({ consultation, readOnly }: EncounterSidebarProps) {
  const update = useUpdateConsultation(consultation.id)
  const [viewingResponseId, setViewingResponseId] = useState<number | null>(null)

  return (
    // En pantallas anchas la barra queda fija al hacer scroll y desplaza su
    // propio contenido (scroll interno) sin mover la página.
    <Box
      sx={{
        width: { xs: '100%', lg: 340 },
        flexShrink: 0,
        borderLeft: { lg: '1px solid' },
        borderColor: { lg: 'divider' },
        pl: { lg: 3 },
        position: { lg: 'sticky' },
        top: { lg: 16 },
        maxHeight: { lg: 'calc(100vh - 32px)' },
        overflowY: { lg: 'auto' },
        overscrollBehavior: 'contain',
        pr: { lg: 1 },
      }}
    >
      {viewingResponseId != null ? (
        <IntakeResponseDetailContent
          responseId={viewingResponseId}
          headerAction={
            <AppButton
              size="small"
              variant="text"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              onClick={() => setViewingResponseId(null)}
            >
              Volver
            </AppButton>
          }
        />
      ) : (
        <Stack spacing={2.5}>
          <div>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>
              Enfermedad actual
            </Typography>
            <AutosaveTextField
              value={consultation.currentIllness ?? ''}
              onSave={(currentIllness) => update.mutate({ currentIllness })}
              disabled={readOnly}
              minRows={3}
            />
          </div>

          <div>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>
              Nota evolutiva
            </Typography>
            <AutosaveTextField
              value={consultation.evolution ?? ''}
              onSave={(evolution) => update.mutate({ evolution })}
              disabled={readOnly}
              minRows={6}
            />
          </div>

          <div>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>
              Plan de tratamiento
            </Typography>
            <AutosaveTextField
              value={consultation.treatmentPlan ?? ''}
              onSave={(treatmentPlan) => update.mutate({ treatmentPlan })}
              disabled={readOnly}
              minRows={4}
            />
          </div>

          <Divider />

          <IntakeResponsesSection
            patientId={consultation.patientId}
            onSelect={setViewingResponseId}
          />

          <Divider />

          <GenerarEntregablesPanel />
        </Stack>
      )}
    </Box>
  )
}
