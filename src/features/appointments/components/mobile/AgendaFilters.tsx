import { Chip, MenuItem, Stack, TextField } from '@mui/material'
import { useSpecialistsLookup } from '@/features/identity'
import type { AppointmentFilters, ConfirmationFilter } from '../../utils/filter-appointments'

type AgendaFiltersProps = {
  filters: AppointmentFilters
  // Solo quien ve citas sin confirmar puede filtrarlas.
  showConfirmation: boolean
  // Solo quien ve las citas de todos elige médico.
  showDoctor: boolean
  onChange: (patch: Partial<AppointmentFilters>) => void
}

const CONFIRMATION_OPTIONS: { value: ConfirmationFilter; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'unconfirmed', label: 'Sin confirmar' },
  { value: 'confirmed', label: 'Confirmadas' },
]

// Filtros compactos de la agenda móvil: confirmación (chips) y médico.
export function AgendaFilters({ filters, showConfirmation, showDoctor, onChange }: AgendaFiltersProps) {
  const { data: specialists = [] } = useSpecialistsLookup()
  if (!showConfirmation && !showDoctor) return null

  return (
    <Stack spacing={1} sx={{ px: 2, pt: 1.5 }}>
      {showConfirmation && (
        <Stack direction="row" spacing={1}>
          {CONFIRMATION_OPTIONS.map((option) => (
            <Chip
              key={option.value || 'all'}
              label={option.label}
              color={filters.confirmation === option.value ? 'primary' : 'default'}
              variant={filters.confirmation === option.value ? 'filled' : 'outlined'}
              onClick={() => onChange({ confirmation: option.value })}
            />
          ))}
        </Stack>
      )}
      {showDoctor && (
        <TextField
          select
          size="small"
          label="Médico"
          value={filters.specialistId}
          onChange={(event) => onChange({ specialistId: event.target.value === '' ? '' : Number(event.target.value) })}
        >
          <MenuItem value="">Todos los médicos</MenuItem>
          {specialists.map((specialist) => (
            <MenuItem key={specialist.id} value={specialist.id}>
              {specialist.name} {specialist.lastName}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  )
}
