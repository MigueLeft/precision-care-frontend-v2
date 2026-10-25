import { MenuItem, Stack, TextField, ToggleButton, Typography } from '@mui/material'
import { ORIENTATION_SPHERES, SCALES } from '../config'
import type { AttrValue } from '../types'
import { GLASGOW_KEYS, glasgowText } from '../utils/controls'

type OrientationControlProps = {
  values: Record<string, AttrValue>
  // Con la conciencia alterada (Estado general) se muestra Glasgow.
  showGlasgow: boolean
  disabled: boolean
  onChange: (key: string, value: AttrValue) => void
}

const GLASGOW_PARTS = [
  { key: GLASGOW_KEYS.eye, label: 'Ocular', scale: SCALES.glasgowEye },
  { key: GLASGOW_KEYS.verbal, label: 'Verbal', scale: SCALES.glasgowVerbal },
  { key: GLASGOW_KEYS.motor, label: 'Motor', scale: SCALES.glasgowMotor },
]

// Esferas de orientación (tiempo, espacio, persona, situación) y Glasgow.
export function OrientationControl({ values, showGlasgow, disabled, onChange }: OrientationControlProps) {
  const total = glasgowText(values)

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {ORIENTATION_SPHERES.map((sphere) => {
          const oriented = values[sphere.key] !== 'no'
          return (
            <ToggleButton
              key={sphere.key}
              size="small"
              value={sphere.key}
              selected={oriented}
              disabled={disabled}
              color="primary"
              onChange={() => onChange(sphere.key, oriented ? 'no' : 'si')}
              sx={{ py: 0.25, textTransform: 'capitalize' }}
            >
              {sphere.label}
            </ToggleButton>
          )
        })}
      </Stack>
      {showGlasgow && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
          <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Glasgow</Typography>
          {GLASGOW_PARTS.map((part) => (
            <TextField
              key={part.key}
              select
              size="small"
              label={part.label}
              value={values[part.key] ?? ''}
              disabled={disabled}
              onChange={(event) => onChange(part.key, event.target.value)}
              sx={{ width: 100 }}
            >
              {part.scale.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ))}
          {total && <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{total}</Typography>}
        </Stack>
      )}
    </Stack>
  )
}
