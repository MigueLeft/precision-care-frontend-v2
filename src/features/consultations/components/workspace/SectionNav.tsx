import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { useSectionCompletion } from '../../hooks/useSectionCompletion'
import { useEncounterWorkspace } from './workspace-context'
import { CLINICAL_SECTIONS, EXTRA_SECTION_LABELS, type ExtraSectionId, type WorkspaceSectionId } from './workspace-sections'
import type { Consultation } from '../../types'

type SectionNavProps = {
  consultation: Consultation
}

const EXTRA_ICONS: Record<ExtraSectionId, SvgIconComponent> = {
  previous: HistoryOutlinedIcon,
  intakes: AssignmentOutlinedIcon,
  deliverables: ReceiptLongOutlinedIcon,
}

const EXTRAS: ExtraSectionId[] = ['previous', 'intakes', 'deliverables']

const itemSx = { borderRadius: '6px', py: 0.5, px: 1, mb: 0.25 }

// Índice de la consulta: cada apartado con su círculo, que se rellena con un
// check cuando ya tiene información cargada.
export function SectionNav({ consultation }: SectionNavProps) {
  const { section, centerView, selectSection } = useEncounterWorkspace()
  const completion = useSectionCompletion(consultation)

  const isActive = (id: WorkspaceSectionId) => centerView === 'section' && section === id

  return (
    <nav aria-label="Apartados de la consulta">
      <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'text.secondary', px: 1, mb: 0.75 }}>
        APARTADOS
      </Typography>
      <List dense disablePadding>
        {CLINICAL_SECTIONS.map(({ id, label }) => (
          <ListItemButton key={id} selected={isActive(id)} onClick={() => selectSection(id)} sx={itemSx}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {completion[id] ? (
                <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} aria-label="Revisado" />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: 'text.disabled' }} aria-label="Sin revisar" />
              )}
            </ListItemIcon>
            <ListItemText primary={label} slotProps={{ primary: { sx: { fontSize: '13px', fontWeight: isActive(id) ? 700 : 500 } } }} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <List dense disablePadding>
        {EXTRAS.map((id) => {
          const Icon = EXTRA_ICONS[id]
          return (
            <ListItemButton key={id} selected={isActive(id)} onClick={() => selectSection(id)} sx={itemSx}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText primary={EXTRA_SECTION_LABELS[id]} slotProps={{ primary: { sx: { fontSize: '13px', fontWeight: isActive(id) ? 700 : 500 } } }} />
            </ListItemButton>
          )
        })}
      </List>
    </nav>
  )
}
