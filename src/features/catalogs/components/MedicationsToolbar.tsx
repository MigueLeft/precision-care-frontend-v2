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

interface MedicationsToolbarProps {
  q: string
  category: string
  categories: string[]
  onlyActive: boolean
  onQChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onOnlyActiveChange: (value: boolean) => void
  onAdd: () => void
}

export function MedicationsToolbar({
  q,
  category,
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
        <Select
          labelId="medication-category-filter-label"
          label="Categoría"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
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
