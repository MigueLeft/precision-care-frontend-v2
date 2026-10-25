import { Chip, Stack, TextField, Tooltip, Typography } from '@mui/material'
import type { PhysicalExamApi } from '../hooks/usePhysicalExam'
import type { ElementConfig, ElementData, ElementPath } from '../types'
import { ElementStateToggle } from './ElementStateToggle'
import { FindingAttributes } from './FindingAttributes'
import { GridControl } from './GridControl'
import { OrientationControl } from './OrientationControl'

type ElementRowProps = {
  config: ElementConfig
  data: ElementData
  path: ElementPath
  api: PhysicalExamApi
  readOnly: boolean
  // Signos vitales fuera de rango: no puede quedar en N.
  lockedAbnormal?: boolean
  showGlasgow?: boolean
}

// Un elemento del sistema: [N] [A] [NE], hallazgos (chips + atributos),
// controles especiales y nota (obligatoria en A sin hallazgos).
export function ElementRow({ config, data, path, api, readOnly, lockedAbnormal, showGlasgow = false }: ElementRowProps) {
  const isAbnormal = data.estado === 'A'
  const showControl = config.control && data.estado !== 'NE'
  const noteRequired = isAbnormal && data.hallazgos.length === 0 && !config.control
  const setValue = (key: string, value: string | number | null) => api.setElementValue(path, key, value)

  return (
    <Stack spacing={1} sx={{ py: 1.25, borderTop: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Typography sx={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>
          {config.label}
          {config.paired && <Typography component="span" sx={{ fontSize: '11px', color: 'text.secondary' }}> · par</Typography>}
          {config.sharedWith && (
            <Typography component="span" sx={{ fontSize: '11px', color: 'text.secondary' }}> · compartido</Typography>
          )}
        </Typography>
        <Tooltip title={lockedAbnormal ? 'Hay signos vitales fuera de rango en esta consulta' : ''}>
          <span>
            <ElementStateToggle
              value={data.estado}
              disabled={readOnly}
              disableNormal={lockedAbnormal}
              onChange={(state) => api.setElementState(path, state)}
            />
          </span>
        </Tooltip>
      </Stack>

      {showControl && config.control === 'orientation' && (
        <OrientationControl values={data.valores} showGlasgow={showGlasgow} disabled={readOnly} onChange={setValue} />
      )}
      {showControl && config.control !== 'orientation' && (
        <GridControl control={config.control!} values={data.valores} disabled={readOnly} onChange={setValue} />
      )}

      {isAbnormal && config.findings.length > 0 && (
        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {config.findings.map((finding) => {
            const selected = data.hallazgos.some((h) => h.codigo === finding.code)
            return (
              <Chip
                key={finding.code}
                size="small"
                label={finding.label}
                color={selected ? 'warning' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                disabled={readOnly}
                onClick={() => api.toggleFinding(path, finding.code)}
              />
            )
          })}
        </Stack>
      )}
      {isAbnormal &&
        data.hallazgos.map((finding) => {
          const findingConfig = config.findings.find((f) => f.code === finding.codigo)
          if (!findingConfig) return null
          return (
            <FindingAttributes
              key={finding.codigo}
              config={findingConfig}
              data={finding}
              paired={!!config.paired}
              disabled={readOnly}
              onChange={(key, value) => api.setFindingAttribute(path, finding.codigo, key, value)}
            />
          )
        })}
      {(isAbnormal || data.nota) && (
        <TextField
          size="small"
          label={noteRequired ? 'Nota (obligatoria sin hallazgos)' : 'Nota'}
          value={data.nota ?? ''}
          error={noteRequired && !data.nota}
          disabled={readOnly}
          multiline
          onChange={(event) => api.setElementNote(path, event.target.value)}
        />
      )}
    </Stack>
  )
}
