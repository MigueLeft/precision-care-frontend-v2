import { useState } from 'react'
import { Button, IconButton, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import type { SystemState } from '../types'

type SystemStateButtonsProps = {
  value: SystemState
  disabled: boolean
  // Genitourinario: "Diferido" como botón visible.
  highlightDeferred?: boolean
  onChange: (state: SystemState) => void
}

const MAIN: { value: SystemState; label: string; color: 'success' | 'warning' | 'standard' }[] = [
  { value: 'NORMAL', label: 'Normal', color: 'success' },
  { value: 'ANORMAL', label: 'Anormal', color: 'warning' },
  { value: 'NO_EXAMINADO', label: 'No examinado', color: 'standard' },
]

// [Normal] [Anormal] [No examinado] + "Diferido". Pulsar el estado activo lo
// regresa a "Sin documentar".
export function SystemStateButtons({ value, disabled, highlightDeferred, onChange }: SystemStateButtonsProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const toggle = (state: SystemState) => onChange(value === state ? 'SIN_DOCUMENTAR' : state)

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} onClick={(event) => event.stopPropagation()}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value}
        disabled={disabled}
        onChange={(_event, next: SystemState | null) => toggle(next ?? value)}
        sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.25, fontSize: '12px', textTransform: 'none' } }}
      >
        {MAIN.map((option) => (
          <ToggleButton key={option.value} value={option.value} color={option.color}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {highlightDeferred ? (
        <Button
          size="small"
          variant={value === 'DIFERIDO' ? 'contained' : 'outlined'}
          color="info"
          disabled={disabled}
          startIcon={<ScheduleOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => toggle('DIFERIDO')}
          sx={{ py: 0.25, fontSize: '12px' }}
        >
          Diferido
        </Button>
      ) : (
        <>
          <Tooltip title="Más opciones">
            <span>
              <IconButton size="small" disabled={disabled} onClick={(event) => setAnchor(event.currentTarget)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
            <MenuItem
              selected={value === 'DIFERIDO'}
              onClick={() => {
                setAnchor(null)
                toggle('DIFERIDO')
              }}
            >
              {value === 'DIFERIDO' ? 'Quitar "Diferido"' : 'Diferido'}
            </MenuItem>
          </Menu>
        </>
      )}
    </Stack>
  )
}
