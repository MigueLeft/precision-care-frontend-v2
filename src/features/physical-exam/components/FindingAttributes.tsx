import { MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { LATERALITY } from '../config'
import type { AttrValue, FindingConfig, FindingData } from '../types'

type FindingAttributesProps = {
  config: FindingConfig
  data: FindingData
  // Estructura par: lateralidad obligatoria.
  paired: boolean
  disabled: boolean
  onChange: (key: string, value: AttrValue) => void
}

// Atributos de un hallazgo marcado: lateralidad, listas, tamaño, texto…
export function FindingAttributes({ config, data, paired, disabled, onChange }: FindingAttributesProps) {
  const attributes = config.attributes ?? []
  if (!paired && attributes.length === 0) return null

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 600, minWidth: 110 }}>{config.label}</Typography>
      {paired && (
        <ToggleButtonGroup
          size="small"
          exclusive
          disabled={disabled}
          value={data.atributos.lateralidad ?? null}
          onChange={(_event, value: string | null) => onChange('lateralidad', value)}
          sx={{ '& .MuiToggleButton-root': { py: 0.25, fontSize: '11.5px' }, outline: data.atributos.lateralidad ? 'none' : '1px solid', outlineColor: 'warning.main', borderRadius: 1 }}
        >
          {LATERALITY.map((side) => (
            <ToggleButton key={side} value={side}>
              {side === 'Bilateral' ? 'Bilateral' : side.slice(0, 3) + '.'}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      {attributes.map((attr) =>
        attr.type === 'select' ? (
          <TextField
            key={attr.key}
            select
            size="small"
            label={attr.label}
            value={data.atributos[attr.key] ?? ''}
            disabled={disabled}
            onChange={(event) => onChange(attr.key, event.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">—</MenuItem>
            {attr.options?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            key={attr.key}
            size="small"
            type={attr.type === 'number' ? 'number' : 'text'}
            label={attr.unit ? `${attr.label} (${attr.unit})` : attr.label || 'Detalle'}
            value={data.atributos[attr.key] ?? ''}
            disabled={disabled}
            onChange={(event) =>
              onChange(attr.key, attr.type === 'number' && event.target.value !== '' ? Number(event.target.value) : event.target.value)
            }
            sx={{ width: attr.type === 'number' ? 120 : 200 }}
          />
        ),
      )}
    </Stack>
  )
}
