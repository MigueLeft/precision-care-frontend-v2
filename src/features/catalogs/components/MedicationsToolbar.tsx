import {
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import type { MedicationCategory } from '../types'

interface MedicationsToolbarProps {
  q: string
  categoryId: number | ''
  categories: MedicationCategory[]
  onlyActive: boolean
  onQChange: (value: string) => void
  onCategoryChange: (value: number | '') => void
  onOnlyActiveChange: (value: boolean) => void
  onAdd: () => void
}

export function MedicationsToolbar({
  q,
  categoryId,
  categories,
  onlyActive,
  onQChange,
  onCategoryChange,
  onOnlyActiveChange,
  onAdd,
}: MedicationsToolbarProps) {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
      <TextField
        placeholder="Buscar medicamento, sustancia…"
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

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="medication-category-filter-label">Categoría</InputLabel>
        <Select<number | ''>
          labelId="medication-category-filter-label"
          label="Categoría"
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value === '' ? '' : Number(event.target.value))}
        >
          <MenuItem value="">Todas</MenuItem>
          {categories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox checked={onlyActive} onChange={(event) => onOnlyActiveChange(event.target.checked)} />
        }
        label="Solo activos"
      />

      <AppButton
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        onClick={onAdd}
        sx={{ ml: 'auto' }}
      >
        Agregar medicamento
      </AppButton>
    </Stack>
  )
}
