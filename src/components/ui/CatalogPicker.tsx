import { useState } from 'react'
import { Autocomplete, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import type { CatalogOption } from './CatalogSearchInput'

export interface CatalogPick {
  name: string
  /** Ausente cuando el valor se escribió a mano (no está en el catálogo). */
  catalogId?: number
}

interface CatalogPickerProps {
  options: CatalogOption[]
  value: CatalogPick | null
  onChange: (value: CatalogPick | null) => void
  placeholder: string
  disabled?: boolean
  manualLabel?: string
  sx?: object
}

// Selector controlado de catálogo para formularios con varios campos: guarda la
// opción elegida (no la envía al seleccionarla, a diferencia de
// CatalogSearchInput). Con la casilla se permite escribir un valor que no está
// en el catálogo; el backend lo agrega al catálogo al guardarlo.
export function CatalogPicker({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  manualLabel = 'No está en el catálogo · escribir manualmente',
  sx,
}: CatalogPickerProps) {
  const [manual, setManual] = useState(false)
  const selected = options.find((option) => option.id === value?.catalogId) ?? null

  return (
    <Stack spacing={0.25} sx={sx}>
      {manual ? (
        <TextField
          size="small"
          placeholder={placeholder}
          value={value?.name ?? ''}
          onChange={(event) =>
            onChange(event.target.value ? { name: event.target.value } : null)
          }
          disabled={disabled}
        />
      ) : (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, current) => option.id === current.id}
          value={selected}
          onChange={(_event, option) =>
            onChange(option ? { name: option.name, catalogId: option.id } : null)
          }
          disabled={disabled}
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
              onChange(null)
            }}
          />
        }
        label={manualLabel}
        sx={{ '& .MuiFormControlLabel-label': { fontSize: '12px', color: 'text.secondary' } }}
      />
    </Stack>
  )
}
