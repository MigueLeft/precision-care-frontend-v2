import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import type { PhysicalExamApi } from '../hooks/usePhysicalExam'
import type { SectionConfig, SectionData, SystemState } from '../types'
import { ElementRow } from './ElementRow'

type SectionElementsProps = {
  systemCode: string
  config: SectionConfig
  data: SectionData
  // Subapartado de ORL: con su propio [N] [A] [NE].
  isSubsection: boolean
  showSubsectionToggle: boolean
  api: PhysicalExamApi
  readOnly: boolean
  lockedAbnormal: (elementCode: string) => boolean
  showGlasgow: boolean
}

const SUB_OPTIONS: { value: SystemState; label: string; color: 'success' | 'warning' | 'standard' }[] = [
  { value: 'NORMAL', label: 'N', color: 'success' },
  { value: 'ANORMAL', label: 'A', color: 'warning' },
  { value: 'NO_EXAMINADO', label: 'NE', color: 'standard' },
]

// Elementos de un sistema o de uno de sus subapartados.
export function SectionElements(props: SectionElementsProps) {
  const { systemCode, config, data, isSubsection, showSubsectionToggle, api, readOnly, lockedAbnormal, showGlasgow } = props
  const section = isSubsection ? data.codigo : undefined

  return (
    <Stack sx={{ mt: isSubsection ? 1.5 : 0.5 }}>
      {isSubsection && showSubsectionToggle && (
        <Stack direction="row" sx={{ alignItems: 'center', mb: 0.5 }}>
          <Typography sx={{ flex: 1, fontSize: '13px', fontWeight: 700, color: 'primary.main' }}>{config.label}</Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={data.estado}
            disabled={readOnly}
            onChange={(_event, next: SystemState | null) =>
              api.setSectionState(systemCode, data.codigo, next ?? 'SIN_DOCUMENTAR')
            }
            sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.25, fontSize: '12px', fontWeight: 700 } }}
          >
            {SUB_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value} color={option.color}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      )}
      {config.elements.map((element) => {
        const elementData = data.elementos.find((e) => e.codigo === element.code)
        if (!elementData) return null
        return (
          <ElementRow
            key={element.code}
            config={element}
            data={elementData}
            path={{ system: systemCode, section, element: element.code }}
            api={api}
            readOnly={readOnly}
            lockedAbnormal={lockedAbnormal(element.code)}
            showGlasgow={showGlasgow}
          />
        )
      })}
    </Stack>
  )
}
