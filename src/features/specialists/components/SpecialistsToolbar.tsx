import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { SearchableSelect } from '@/components/SearchableSelect'
import { useMedicalSpecialties } from '@/features/catalogs'

export type SpecialistStatusFilter = 'all' | 'active' | 'inactive'

interface Props {
  q: string
  specialtyId: number | undefined
  status: SpecialistStatusFilter
  onQChange: (value: string) => void
  onSpecialtyChange: (value: number | undefined) => void
  onStatusChange: (value: SpecialistStatusFilter) => void
}

export function SpecialistsToolbar({
  q,
  specialtyId,
  status,
  onQChange,
  onSpecialtyChange,
  onStatusChange,
}: Props) {
  const navigate = useNavigate()
  const { data: specialties = [] } = useMedicalSpecialties()

  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
      <TextField
        placeholder="Buscar por nombre, correo o especialidad…"
        value={q}
        onChange={(event) => onQChange(event.target.value)}
        sx={{ minWidth: 300 }}
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

      <Box sx={{ minWidth: 220 }}>
        <SearchableSelect
          label="Especialidad"
          placeholder="Todas"
          options={specialties.map((s) => ({ id: s.id, label: s.name }))}
          value={specialtyId}
          onChange={onSpecialtyChange}
        />
      </Box>

      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="specialist-status-filter">Estado</InputLabel>
        <Select
          labelId="specialist-status-filter"
          label="Estado"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as SpecialistStatusFilter)}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="active">Activos</MenuItem>
          <MenuItem value="inactive">Desactivados</MenuItem>
        </Select>
      </FormControl>

      <AppButton
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate({ to: '/especialistas/nuevo' })}
        sx={{ ml: 'auto' }}
      >
        Crear especialista
      </AppButton>
    </Stack>
  )
}
