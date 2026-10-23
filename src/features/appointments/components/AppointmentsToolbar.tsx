import {
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined'
import type { SpecialistLookup } from '@/features/identity'
import {
  defaultAppointmentFilters,
  isDefaultFilters,
  type AppointmentFilters,
} from '../utils/filter-appointments'
import { APPOINTMENT_MODALITY_LABELS } from '../utils/appointment-helpers'
import type { AppointmentModality } from '../types'
import { ConfirmationFilterSelect } from './ConfirmationFilterSelect'
import { StatusFilterSelect } from './StatusFilterSelect'

interface AppointmentsToolbarProps {
  filters: AppointmentFilters
  specialists: SpecialistLookup[]
  onChange: (patch: Partial<AppointmentFilters>) => void
  // Un especialista solo ve sus citas: se oculta el toggle "Mis citas / Todas".
  isSpecialist: boolean
  // En semana/mes el periodo lo define el calendario: sin "desde/hasta".
  showDateRange: boolean
}

const MODALITY_KEYS: AppointmentModality[] = ['in_person', 'telemedicine']

export function AppointmentsToolbar({
  filters,
  specialists,
  onChange,
  isSpecialist,
  showDateRange,
}: AppointmentsToolbarProps) {
  const hasActiveFilters = !isDefaultFilters(filters)

  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}
    >
      {!isSpecialist && (
        <ToggleButtonGroup
          size="small"
          exclusive
          value={filters.scope}
          onChange={(_e, value) => value && onChange({ scope: value })}
        >
          <ToggleButton value="mine">Mis citas</ToggleButton>
          <ToggleButton value="all">Todas</ToggleButton>
        </ToggleButtonGroup>
      )}

      <TextField
        placeholder="Buscar paciente o motivo…"
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value })}
        sx={{ minWidth: 240 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {showDateRange && (
        <>
          <TextField
            type="date"
            value={filters.from}
            onChange={(e) => onChange({ from: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 160 }}
          />
          <Typography sx={{ color: 'text.secondary' }}>→</Typography>
          <TextField
            type="date"
            value={filters.to}
            onChange={(e) => onChange({ to: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 160 }}
          />
        </>
      )}

      {/* El especialista solo ve citas confirmadas: el filtro no aplica. */}
      {!isSpecialist && (
        <ConfirmationFilterSelect
          value={filters.confirmation}
          onChange={(confirmation) => onChange({ confirmation })}
        />
      )}

      <StatusFilterSelect value={filters.statuses} onChange={(statuses) => onChange({ statuses })} />

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="appt-modality-label">Modalidad</InputLabel>
        <Select
          labelId="appt-modality-label"
          label="Modalidad"
          value={filters.modality}
          onChange={(e) =>
            onChange({ modality: e.target.value as AppointmentModality | '' })
          }
        >
          <MenuItem value="">Todas</MenuItem>
          {MODALITY_KEYS.map((key) => (
            <MenuItem key={key} value={key}>
              {APPOINTMENT_MODALITY_LABELS[key]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 170 }}>
        <InputLabel id="appt-specialist-label">Especialista</InputLabel>
        <Select<number | ''>
          labelId="appt-specialist-label"
          label="Especialista"
          value={filters.specialistId}
          onChange={(e) => {
            const raw = e.target.value
            onChange({ specialistId: raw === '' ? '' : Number(raw) })
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          {specialists.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name} {s.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Button
          size="small"
          color="inherit"
          startIcon={<FilterAltOffOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => onChange(defaultAppointmentFilters)}
        >
          Limpiar filtros
        </Button>
      )}
    </Stack>
  )
}
