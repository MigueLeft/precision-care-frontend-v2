import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import type { ElementState } from '../types'

const OPTIONS: { value: ElementState; label: string; title: string; color: 'success' | 'warning' | 'standard' }[] = [
  { value: 'N', label: 'N', title: 'Normal', color: 'success' },
  { value: 'A', label: 'A', title: 'Anormal', color: 'warning' },
  { value: 'NE', label: 'NE', title: 'No evaluado', color: 'standard' },
]

type ElementStateToggleProps = {
  value: ElementState
  disabled?: boolean
  disableNormal?: boolean
  onChange: (state: ElementState) => void
}

// [N] [A] [NE] de un elemento.
export function ElementStateToggle({ value, disabled, disableNormal, onChange }: ElementStateToggleProps) {
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={value}
      disabled={disabled}
      onChange={(_event, next: ElementState | null) => next && onChange(next)}
      sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.25, fontSize: '12px', fontWeight: 700, minWidth: 38 } }}
    >
      {OPTIONS.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          title={option.title}
          color={option.color}
          disabled={option.value === 'N' && disableNormal}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
