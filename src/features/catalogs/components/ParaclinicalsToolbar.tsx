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
import type { ParaclinicalCategoryCatalog } from '../types'
import { childCategories, rootCategories } from '../utils/paraclinical-category-tree'

interface ParaclinicalsToolbarProps {
  q: string
  categoryId: number | ''
  subcategoryId: number | ''
  categories: ParaclinicalCategoryCatalog[]
  onlyActive: boolean
  onQChange: (value: string) => void
  onCategoryChange: (value: number | '') => void
  onSubcategoryChange: (value: number | '') => void
  onOnlyActiveChange: (value: boolean) => void
  onAdd: () => void
}

export function ParaclinicalsToolbar({
  q,
  categoryId,
  subcategoryId,
  categories,
  onlyActive,
  onQChange,
  onCategoryChange,
  onSubcategoryChange,
  onOnlyActiveChange,
  onAdd,
}: ParaclinicalsToolbarProps) {
  const roots = rootCategories(categories)
  const subcategories = categoryId ? childCategories(categories, categoryId) : []
  const toValue = (raw: number | string) => (raw === '' ? '' : Number(raw))

  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
      <TextField
        placeholder="Buscar paraclínico…"
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

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="paraclinical-category-filter-label">Categoría</InputLabel>
        <Select<number | ''>
          labelId="paraclinical-category-filter-label"
          label="Categoría"
          value={categoryId}
          onChange={(event) => onCategoryChange(toValue(event.target.value))}
        >
          <MenuItem value="">Todas</MenuItem>
          {roots.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 220 }} disabled={subcategories.length === 0}>
        <InputLabel id="paraclinical-subcategory-filter-label">Subcategoría</InputLabel>
        <Select<number | ''>
          labelId="paraclinical-subcategory-filter-label"
          label="Subcategoría"
          value={subcategoryId}
          onChange={(event) => onSubcategoryChange(toValue(event.target.value))}
        >
          <MenuItem value="">Todas</MenuItem>
          {subcategories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
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
        Agregar paraclínico
      </AppButton>
    </Stack>
  )
}
