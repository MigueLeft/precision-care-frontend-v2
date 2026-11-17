import { Autocomplete, TextField } from '@mui/material'
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

// Los estados elegidos se quitan desde sus chips y se ocultan en la lista.
export function StatusFilterSelect({ value, onChange }: StatusFilterSelectProps) {
  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      disableCloseOnSelect
      options={STATUS_KEYS}
      value={value}
      onChange={(_event, statuses) => onChange(statuses)}
      getOptionLabel={(status) => APPOINTMENT_STATUS_LABELS[status]}
      renderInput={(params) => <TextField {...params} label="Estado" placeholder={value.length === 0 ? 'Todos' : undefined} />}
      sx={{ width: 220 }}
    />
  )
}
