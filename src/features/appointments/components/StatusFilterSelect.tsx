import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { APPOINTMENT_STATUS_LABELS } from '../utils/appointment-helpers'
import type { AppointmentStatus } from '../types'

const STATUS_KEYS: AppointmentStatus[] = [
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled_by_clinic',
  'no_show',
]

type StatusFilterSelectProps = {
  value: AppointmentStatus[]
  onChange: (statuses: AppointmentStatus[]) => void
}

// Selección múltiple de estados. Ancho fijo: con varios estados
// seleccionados el texto se recorta con "…".
export function StatusFilterSelect({ value, onChange }: StatusFilterSelectProps) {
  return (
    <FormControl sx={{ width: 220 }}>
      <InputLabel id="appt-status-label">Estado</InputLabel>
      <Select<AppointmentStatus[]>
        labelId="appt-status-label"
        label="Estado"
        multiple
        sx={{
          '& .MuiSelect-select': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        }}
        value={value}
        onChange={(e) =>
          onChange(typeof e.target.value === 'string' ? [] : (e.target.value as AppointmentStatus[]))
        }
        renderValue={(selected) =>
          selected.length === 0 ? 'Todos' : selected.map((s) => APPOINTMENT_STATUS_LABELS[s]).join(', ')
        }
      >
        {STATUS_KEYS.map((key) => (
          <MenuItem key={key} value={key}>
            <Checkbox size="small" checked={value.includes(key)} />
            <ListItemText primary={APPOINTMENT_STATUS_LABELS[key]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
