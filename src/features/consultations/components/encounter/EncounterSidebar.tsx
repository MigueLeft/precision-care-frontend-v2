import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AppButton } from '@/components/AppButton'
import { IntakeResponseDetailContent } from '@/features/intake-responses'
import { EvolutionChanges } from '../evolution/EvolutionChanges'
import { GenerarEntregablesPanel } from './GenerarEntregablesPanel'
import { IntakeResponsesSection } from './IntakeResponsesSection'
import { SidebarClinicalFields } from './SidebarClinicalFields'
import type { Consultation } from '../../types'

interface EncounterSidebarProps {
  consultation: Consultation
  readOnly: boolean
}

// Vista activa de la barra: los campos, una respuesta de ingresable o los
// cambios respecto a la consulta anterior (nota evolutiva automática).
type SidebarView = { kind: 'fields' } | { kind: 'intake'; responseId: number } | { kind: 'evolution' }

export function EncounterSidebar({ consultation, readOnly }: EncounterSidebarProps) {
  const [view, setView] = useState<SidebarView>({ kind: 'fields' })

  const backButton = (
    <AppButton
      size="small"
      variant="text"
      startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
      onClick={() => setView({ kind: 'fields' })}
    >
      Volver
    </AppButton>
  )

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
        // Scroll funcional pero sin barra visible (Firefox, Edge legacy, Chromium/Safari).
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {view.kind === 'intake' && (
        <IntakeResponseDetailContent responseId={view.responseId} headerAction={backButton} />
      )}

      {view.kind === 'evolution' && (
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h3">Cambios vs. consulta anterior</Typography>
            {backButton}
          </Stack>
          <EvolutionChanges consultationId={consultation.id} />
        </Stack>
      )}

      {view.kind === 'fields' && (
        <Stack spacing={2.5}>
          <SidebarClinicalFields
            consultation={consultation}
            readOnly={readOnly}
            onShowEvolution={() => setView({ kind: 'evolution' })}
          />

          <Divider />

          <IntakeResponsesSection
            patientId={consultation.patientId}
            onSelect={(responseId) => setView({ kind: 'intake', responseId })}
          />

          <Divider />

          <GenerarEntregablesPanel />
        </Stack>
      )}
    </Box>
  )
}
