import { useState } from 'react'
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'

export interface CatalogOption {
  id: number
  name: string
}

interface CatalogSearchInputProps {
  options: CatalogOption[]
  placeholder: string
  /** Al elegir una opción del catálogo se pasa su id; al escribir a mano, sin id. */
  onAdd: (name: string, catalogId?: number) => void
  disabled?: boolean
  /** Texto de la casilla para habilitar la escritura libre. */
  manualLabel?: string
  sx?: object
}

// Buscador de catálogo: por defecto solo permite elegir opciones existentes
// (Enter selecciona la resaltada). Para agregar algo que no está en el catálogo
// hay que marcar la casilla "escribir manualmente".
export function CatalogSearchInput({
  options,
  placeholder,
  onAdd,
  disabled,
  manualLabel = 'No está en el catálogo · escribir manualmente',
  sx,
}: CatalogSearchInputProps) {
  const [manual, setManual] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [manualText, setManualText] = useState('')

  function submitManual() {
    const clean = manualText.trim()
    if (!clean) return
    onAdd(clean)
    setManualText('')
  }

  return (
    <Stack spacing={0.75} sx={sx}>
      {manual ? (
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            fullWidth
            placeholder={placeholder}
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitManual()
            }}
            disabled={disabled}
          />
          <AppButton
            variant="outlined"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={submitManual}
            disabled={disabled}
          >
            Agregar
          </AppButton>
        </Stack>
      ) : (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.name}
          value={null}
          inputValue={inputValue}
          onInputChange={(_event, value, reason) => {
            if (reason !== 'reset') setInputValue(value)
          }}
          blurOnSelect
          disabled={disabled}
          onChange={(_event, option) => {
            if (option) onAdd(option.name, option.id)
            setInputValue('')
          }}
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder={placeholder} />
          )}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={manual}
            onChange={(event) => {
              setManual(event.target.checked)
              setInputValue('')
              setManualText('')
            }}
          />
        }
        label={manualLabel}
        sx={{ '& .MuiFormControlLabel-label': { fontSize: '12px', color: 'text.secondary' } }}
      />
    </Stack>
  )
}
