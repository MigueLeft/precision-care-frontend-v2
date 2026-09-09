import {
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
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
import {
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_STATUS_LABELS,
} from '../utils/appointment-helpers'
import type { AppointmentModality, AppointmentStatus } from '../types'

interface AppointmentsToolbarProps {
  filters: AppointmentFilters
  specialists: SpecialistLookup[]
  onChange: (patch: Partial<AppointmentFilters>) => void
  // Un especialista solo ve sus citas: se oculta el toggle "Mis citas / Todas".
  isSpecialist: boolean
}

const STATUS_KEYS: AppointmentStatus[] = [
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled_by_clinic',
  'no_show',
]
const MODALITY_KEYS: AppointmentModality[] = ['in_person', 'telemedicine']

export function AppointmentsToolbar({
  filters,
  specialists,
  onChange,
  isSpecialist,
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

      <FormControl sx={{ minWidth: 190 }}>
        <InputLabel id="appt-status-label">Estado</InputLabel>
        <Select<AppointmentStatus[]>
          labelId="appt-status-label"
          label="Estado"
          multiple
          value={filters.statuses}
          onChange={(e) =>
            onChange({
              statuses:
                typeof e.target.value === 'string'
                  ? []
                  : (e.target.value as AppointmentStatus[]),
            })
          }
          renderValue={(selected) =>
            selected.length === 0
              ? 'Todos'
              : selected.map((s) => APPOINTMENT_STATUS_LABELS[s]).join(', ')
          }
        >
          {STATUS_KEYS.map((key) => (
            <MenuItem key={key} value={key}>
              <Checkbox size="small" checked={filters.statuses.includes(key)} />
              <ListItemText primary={APPOINTMENT_STATUS_LABELS[key]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
