import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { rootCategories, type ParaclinicalCategoryCatalog } from '@/features/catalogs'

type RootCategorySelectProps = {
  categories: ParaclinicalCategoryCatalog[]
  value: number | ''
  onChange: (value: number | '') => void
}

// Solo categorías raíz (Laboratorio, Imagen…); sus subcategorías se incluyen al filtrar.
export function RootCategorySelect({ categories, value, onChange }: RootCategorySelectProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="paraclinical-category">Categoría</InputLabel>
      <Select<number | ''>
        labelId="paraclinical-category"
        label="Categoría"
        value={value}
        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
      >
        <MenuItem value="">Todas</MenuItem>
        {rootCategories(categories.filter((category) => category.active)).map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
