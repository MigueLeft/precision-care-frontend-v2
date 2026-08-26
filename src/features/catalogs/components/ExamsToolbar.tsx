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
import { examCategoryOptions } from '../schemas/exam-form.schema'
import type { ExamCategory } from '../types'

const CATEGORY_LABELS: Record<ExamCategory, string> = {
  laboratory: 'Laboratorio',
  imaging: 'Imagenología',
  cardiology: 'Cardiología',
  other: 'Otro',
}

interface ExamsToolbarProps {
  q: string
  category: ExamCategory | ''
  onlyActive: boolean
  onQChange: (value: string) => void
  onCategoryChange: (value: ExamCategory | '') => void
  onOnlyActiveChange: (value: boolean) => void
  onAdd: () => void
}

export function ExamsToolbar({
  q,
  category,
  onlyActive,
  onQChange,
  onCategoryChange,
  onOnlyActiveChange,
  onAdd,
}: ExamsToolbarProps) {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
      <TextField
        placeholder="Buscar examen…"
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
        <InputLabel id="exam-category-filter-label">Categoría</InputLabel>
        <Select
          labelId="exam-category-filter-label"
          label="Categoría"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as ExamCategory | '')}
        >
          <MenuItem value="">Todas</MenuItem>
          {examCategoryOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {CATEGORY_LABELS[option]}
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
        Agregar examen
      </AppButton>
    </Stack>
  )
}
