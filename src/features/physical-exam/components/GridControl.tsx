import { Box, MenuItem, TextField, Typography } from '@mui/material'
import { GRID_SIDES } from '../config'
import type { AttrValue, ElementControl } from '../types'
import { gridKey, gridOf } from '../utils/controls'

type GridControlProps = {
  control: ElementControl
  values: Record<string, AttrValue>
  disabled: boolean
  onChange: (key: string, value: AttrValue) => void
}

// Cuadrícula fila × lado (pulsos 0–4+, reflejos 0–4+, fuerza 0–5). Lo
// distinto del valor normal se resalta y pasa el elemento a anormal.
export function GridControl({ control, values, disabled, onChange }: GridControlProps) {
  const grid = gridOf(control)
  if (!grid) return null

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) repeat(2, 96px)', gap: 0.75, alignItems: 'center' }}>
      <span />
      {GRID_SIDES.map((side) => (
        <Typography key={side.key} sx={{ fontSize: '11px', color: 'text.secondary', textAlign: 'center', textTransform: 'capitalize' }}>
          {side.label}
        </Typography>
      ))}
      {grid.rows.map((row) => [
        <Typography key={row.key} sx={{ fontSize: '12.5px' }}>
          {row.label}
        </Typography>,
        ...GRID_SIDES.map((side) => {
          const key = gridKey(row.key, side.key)
          const value = values[key] ?? ''
          const abnormal = value !== '' && value !== grid.normal
          return (
            <TextField
              key={key}
              select
              size="small"
              value={value}
              disabled={disabled}
              onChange={(event) => onChange(key, event.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: abnormal ? 'warning.light' : undefined } }}
            >
              {grid.scale.map((option) => (
                <MenuItem key={option} value={option}>
                  {control === 'strength' ? `${option}/5` : option}
                </MenuItem>
              ))}
            </TextField>
          )
        }),
      ])}
    </Box>
  )
}
