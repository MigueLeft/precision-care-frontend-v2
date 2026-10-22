import { useState } from 'react'
import { Autocomplete, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import { CatalogOptionItem } from './CatalogOptionItem'
import { filterCatalogOptions } from './catalog-option-filter'
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
  label?: string
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
  label,
  disabled,
  manualLabel = 'No está en el catálogo · escribir manualmente',
  sx,
}: CatalogPickerProps) {
  // Un valor ya guardado sin id de catálogo (escrito a mano) abre en modo manual.
  const [manual, setManual] = useState(() => !!value?.name && value.catalogId === undefined)
  const found = options.find((option) => option.id === value?.catalogId)
  // Si el id guardado no está entre las opciones (ej. inactivo), se muestra igual.
  const selected =
    found ?? (value?.catalogId !== undefined ? { id: value.catalogId, name: value.name } : null)
  const list = found || !selected ? options : [...options, selected]

  return (
    <Stack spacing={0.25} sx={sx}>
      {manual ? (
        <TextField
          size="small"
          label={label}
          placeholder={placeholder}
          value={value?.name ?? ''}
          onChange={(event) =>
            onChange(event.target.value ? { name: event.target.value } : null)
          }
          disabled={disabled}
        />
      ) : (
        <Autocomplete
          options={list}
          getOptionLabel={(option) => option.name}
          filterOptions={filterCatalogOptions}
          renderOption={({ key, ...props }, option) => (
            <CatalogOptionItem key={key} option={option} {...props} />
          )}
          isOptionEqualToValue={(option, current) => option.id === current.id}
          value={selected}
          onChange={(_event, option) =>
            onChange(option ? { name: option.name, catalogId: option.id } : null)
          }
          disabled={disabled}
          renderInput={(params) => (
            <TextField {...params} size="small" label={label} placeholder={placeholder} />
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
