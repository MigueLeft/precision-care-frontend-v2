import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import type { ConfirmationFilter } from '../utils/filter-appointments'

type ConfirmationFilterSelectProps = {
  value: ConfirmationFilter
  onChange: (value: ConfirmationFilter) => void
}

// Citas confirmadas (el médico ya las ve) o sin confirmar (aún no).
export function ConfirmationFilterSelect({ value, onChange }: ConfirmationFilterSelectProps) {
  return (
    <FormControl sx={{ minWidth: 170 }}>
      <InputLabel id="appt-confirmation-label">Confirmación</InputLabel>
      <Select<ConfirmationFilter>
        labelId="appt-confirmation-label"
        label="Confirmación"
        value={value}
        onChange={(event) => onChange(event.target.value as ConfirmationFilter)}
      >
        <MenuItem value="">Todas</MenuItem>
        <MenuItem value="confirmed">Confirmadas</MenuItem>
        <MenuItem value="unconfirmed">Sin confirmar</MenuItem>
      </Select>
    </FormControl>
  )
}
