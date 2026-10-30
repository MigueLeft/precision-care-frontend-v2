import { Stack } from '@mui/material'
import { CenterPanel } from './CenterPanel'
import { RightPanel } from './RightPanel'
import { SectionNav } from './SectionNav'
import { WorkspaceColumn } from './WorkspaceColumn'
import { EncounterWorkspaceContext, useEncounterWorkspaceState } from './workspace-context'
import { hasRightPanel } from './workspace-sections'
import type { Consultation } from '../../types'

type ConsultationWorkspaceProps = {
  consultation: Consultation
  readOnly: boolean
}

// Consulta en tres columnas: índice de apartados (izquierda), panel central y
// panel de captura / ingresable fijado (derecha).
export function ConsultationWorkspace({ consultation, readOnly }: ConsultationWorkspaceProps) {
  // Primera vez abre en Antecedentes; subsecuente, en la consulta anterior.
  const workspace = useEncounterWorkspaceState(consultation.visitType === 'subsequent' ? 'previous' : 'antecedents')
  const showRight = hasRightPanel(workspace.section, readOnly, workspace.pinnedIntakeId)

  return (
    <EncounterWorkspaceContext.Provider value={workspace}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ p: 3, alignItems: 'flex-start' }}>
        <WorkspaceColumn sx={{ width: { lg: 210 } }}>
          <SectionNav consultation={consultation} />
        </WorkspaceColumn>

        <CenterPanel consultation={consultation} readOnly={readOnly} />

        {showRight && (
          <WorkspaceColumn
            sx={{
              width: { lg: 360 },
              borderLeft: { lg: '1px solid' },
              borderColor: { lg: 'divider' },
              pl: { lg: 3 },
            }}
          >
            <RightPanel consultation={consultation} readOnly={readOnly} />
          </WorkspaceColumn>
        )}
      </Stack>
    </EncounterWorkspaceContext.Provider>
  )
}
