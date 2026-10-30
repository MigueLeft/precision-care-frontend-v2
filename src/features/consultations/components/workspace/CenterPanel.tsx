import { Stack, Typography } from '@mui/material'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AppButton } from '@/components/AppButton'
import { SectionDensityContext } from '@/components/ui/section-density'
import { NotesPanel } from './NotesPanel'
import { SectionContent } from './SectionContent'
import { useEncounterWorkspace } from './workspace-context'
import { sectionLabel } from './workspace-sections'
import type { Consultation } from '../../types'

type CenterPanelProps = {
  consultation: Consultation
  readOnly: boolean
}

// Panel central: el apartado elegido o, con "Abrir notas", los campos de texto
// libre y los Problemas de la consulta.
export function CenterPanel({ consultation, readOnly }: CenterPanelProps) {
  const { section, centerView, toggleNotes } = useEncounterWorkspace()
  const showingNotes = centerView === 'notes'

  return (
    <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'text.secondary' }}>
          {showingNotes ? 'NOTAS DE LA CONSULTA' : sectionLabel(section).toUpperCase()}
        </Typography>
        <AppButton
          size="small"
          variant={showingNotes ? 'text' : 'outlined'}
          startIcon={showingNotes ? <ArrowBackIcon sx={{ fontSize: 16 }} /> : <EditNoteOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={toggleNotes}
        >
          {showingNotes ? `Volver a ${sectionLabel(section)}` : 'Abrir notas'}
        </AppButton>
      </Stack>

      {/* Apartados compactos: la consulta tiene muchas secciones. */}
      <SectionDensityContext.Provider value="compact">
        {showingNotes ? (
          <NotesPanel consultation={consultation} readOnly={readOnly} />
        ) : (
          <SectionContent key={section} section={section} consultation={consultation} readOnly={readOnly} />
        )}
      </SectionDensityContext.Provider>
    </Stack>
  )
}
