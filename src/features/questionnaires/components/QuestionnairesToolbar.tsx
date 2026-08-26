import { Stack, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'

interface QuestionnairesToolbarProps {
  q: string
  type: string
  onQChange: (value: string) => void
  onTypeChange: (value: string) => void
  onAdd: () => void
}

const TYPE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'lifestyle', label: 'Estilo de vida' },
  { value: 'psychometric', label: 'Psicométrico' },
  { value: 'antecedents', label: 'Antecedentes' },
  { value: 'other', label: 'Otro' },
]

export function QuestionnairesToolbar({
  q,
  type,
  onQChange,
  onTypeChange,
  onAdd,
}: QuestionnairesToolbarProps) {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
      <TextField
        placeholder="Buscar ingresable…"
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
        <InputLabel id="questionnaire-type-filter-label">Tipo</InputLabel>
        <Select
          labelId="questionnaire-type-filter-label"
          label="Tipo"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
        >
          {TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <AppButton
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        onClick={onAdd}
        sx={{ ml: 'auto' }}
      >
        Nuevo ingresable
      </AppButton>
    </Stack>
  )
}
