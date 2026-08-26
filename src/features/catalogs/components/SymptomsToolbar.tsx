import { Stack, TextField, InputAdornment, FormControlLabel, Checkbox } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'

interface SymptomsToolbarProps {
  q: string
  onlyActive: boolean
  onQChange: (value: string) => void
  onOnlyActiveChange: (value: boolean) => void
  onAdd: () => void
}

export function SymptomsToolbar({ q, onlyActive, onQChange, onOnlyActiveChange, onAdd }: SymptomsToolbarProps) {
  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
      <TextField
        placeholder="Buscar síntoma…"
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
        Agregar síntoma
      </AppButton>
    </Stack>
  )
}
