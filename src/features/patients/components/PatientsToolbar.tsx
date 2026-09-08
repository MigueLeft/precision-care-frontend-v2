import { Box, Stack, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { SearchableSelect } from '@/components/SearchableSelect'
import { MoreFiltersButton } from './MoreFiltersButton'
import type { Country } from '@/features/catalogs'

interface PatientsToolbarProps {
  q: string
  nationalityCountryId: number | undefined
  countries: Country[]
  onQChange: (value: string) => void
  onNationalityChange: (value: number | undefined) => void
  onNewPatient: () => void
}

export function PatientsToolbar({
  q,
  nationalityCountryId,
  countries,
  onQChange,
  onNationalityChange,
  onNewPatient,
}: PatientsToolbarProps) {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
      <TextField
        placeholder="Buscar por nombre o correo…"
        value={q}
        onChange={(event) => onQChange(event.target.value)}
        sx={{ minWidth: 280 }}
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
          label="Nacionalidad"
          placeholder="Todas"
          options={countries.map((country) => ({ id: country.id, label: country.name }))}
          value={nationalityCountryId}
          onChange={onNationalityChange}
        />
      </Box>

      <MoreFiltersButton />

      <AppButton
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        onClick={onNewPatient}
        sx={{ ml: 'auto' }}
      >
        Nuevo paciente
      </AppButton>
    </Stack>
  )
}
