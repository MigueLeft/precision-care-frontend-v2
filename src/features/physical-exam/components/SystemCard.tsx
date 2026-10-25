import { useRef, useState } from 'react'
import { Alert, Box, Button, Collapse, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { PhysicalExamApi } from '../hooks/usePhysicalExam'
import type { SystemConfig, SystemData, SystemState } from '../types'
import { sectionsOf } from '../utils/config-lookup'
import { ReasonPicker } from './ReasonPicker'
import { SectionElements } from './SectionElements'
import { SystemStateButtons } from './SystemStateButtons'

type SystemCardProps = {
  config: SystemConfig
  data: SystemData
  index: number
  narrative: string | undefined
  errors: string[]
  mandatory: boolean
  api: PhysicalExamApi
  readOnly: boolean
  lockedAbnormal: (system: string, element: string) => boolean
  showGlasgow: boolean
}

// Un sistema del examen: estado, motivo, narrativa resumida y sus elementos.
export function SystemCard(props: SystemCardProps) {
  const { config, data, index, narrative, errors, mandatory, api, readOnly, lockedAbnormal, showGlasgow } = props
  const [expanded, setExpanded] = useState(data.estado === 'ANORMAL')
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const sections = sectionsOf(config, data)
  const skipped = data.estado === 'NO_EXAMINADO' || data.estado === 'DIFERIDO'
  const hasPending = sections.some((s) => s.data.elementos.some((e) => e.estado === 'NE'))

  function changeState(state: SystemState) {
    api.setSystemState(config.code, state, skipped && (state === 'NO_EXAMINADO' || state === 'DIFERIDO') ? data.motivo : null)
    // Anormal: se abre y el foco va al primer elemento.
    if (state === 'ANORMAL') {
      setExpanded(true)
      setTimeout(() => bodyRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus(), 50)
    }
  }

  return (
    <Paper id={`exam-system-${config.code}`} sx={{ p: 1.5, borderRadius: '8px', borderColor: errors.length ? 'warning.main' : undefined }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ alignItems: { md: 'center' } }}>
        <Button
          color="inherit"
          onClick={() => setExpanded((value) => !value)}
          endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />}
          sx={{ flex: 1, justifyContent: 'flex-start', textTransform: 'none', fontSize: '14px', fontWeight: 600 }}
        >
          {index}. {config.label}
          {mandatory && data.estado === 'SIN_DOCUMENTAR' && (
            <Box component="span" sx={{ ml: 1, fontSize: '11px', fontWeight: 600, color: 'warning.dark' }}>
              obligatorio
            </Box>
          )}
        </Button>
        <SystemStateButtons value={data.estado} disabled={readOnly} highlightDeferred={config.highlightDeferred} onChange={changeState} />
      </Stack>

      {skipped && <ReasonPicker value={data.motivo} disabled={readOnly} onChange={(motivo) => api.setSystemState(config.code, data.estado, motivo)} />}
      {data.estado === 'NORMAL' && !expanded && narrative && (
        <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', mt: 0.5, pl: 1 }}>
          {narrative}{' '}
          <Button size="small" onClick={() => setExpanded(true)} sx={{ py: 0, minWidth: 0, textTransform: 'none' }}>
            Ver detalle
          </Button>
        </Typography>
      )}

      <Collapse in={expanded && !skipped} unmountOnExit>
        <Box ref={bodyRef} sx={{ pl: 1, pt: 0.5 }}>
          {config.variants && (
            <ToggleButtonGroup
              size="small"
              exclusive
              value={data.variante ?? 'femenino'}
              disabled={readOnly}
              onChange={(_event, next: 'masculino' | 'femenino' | null) => next && api.setVariant(next)}
              sx={{ mb: 1, '& .MuiToggleButton-root': { py: 0.25, textTransform: 'none' } }}
            >
              <ToggleButton value="femenino">Femenino</ToggleButton>
              <ToggleButton value="masculino">Masculino</ToggleButton>
            </ToggleButtonGroup>
          )}
          {sections.map((section) => (
            <SectionElements
              key={section.config.code}
              systemCode={config.code}
              config={section.config}
              data={section.data}
              isSubsection={section.isSubsection}
              showSubsectionToggle={!!config.subsections}
              api={api}
              readOnly={readOnly}
              lockedAbnormal={(element) => lockedAbnormal(config.code, element)}
              showGlasgow={showGlasgow}
            />
          ))}
          {data.estado === 'ANORMAL' && hasPending && !readOnly && (
            <Button size="small" onClick={() => api.setRestNormal(config.code)} sx={{ mt: 1, textTransform: 'none' }}>
              Marcar el resto como normal
            </Button>
          )}
        </Box>
      </Collapse>

      {errors.length > 0 && (
        <Alert severity="warning" sx={{ mt: 1, py: 0, '& .MuiAlert-message': { fontSize: '12px' } }}>
          {errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </Alert>
      )}
    </Paper>
  )
}
