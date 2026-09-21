import { Autocomplete, TextField, Chip } from '@mui/material'
import type { SearchableOption } from './SearchableSelect'

interface SearchableMultiSelectProps {
  label: string
  options: SearchableOption[]
  value: number[]
  onChange: (ids: number[]) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
  placeholder?: string
  /** Máximo de opciones visibles en la lista antes de hacer scroll. */
  maxVisibleOptions?: number
}

// Alto de cada fila de la lista (px); coincide con el `minHeight` fijado abajo.
const OPTION_HEIGHT = 40

// Variante múltiple de `SearchableSelect` — para "Otras especialidades" y
// campos similares de selección múltiple con búsqueda.
export function SearchableMultiSelect({
  label,
  options,
  value,
  onChange,
  disabled,
  error,
  helperText,
  placeholder,
  maxVisibleOptions,
}: SearchableMultiSelectProps) {
  const selected = options.filter((option) => value.includes(option.id))

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={options}
      value={selected}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onChange={(_event, next) => onChange(next.map((option) => option.id))}
      slotProps={
        maxVisibleOptions
          ? {
              listbox: {
                sx: {
                  maxHeight: maxVisibleOptions * OPTION_HEIGHT + 16,
                  '& .MuiAutocomplete-option': { minHeight: OPTION_HEIGHT },
                },
              },
            }
          : undefined
      }
      renderValue={(items, getItemProps) =>
        items.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index })
          return (
            <Chip
              {...itemProps}
              key={key}
              label={option.label}
              size="small"
            />
          )
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={selected.length === 0 ? placeholder : undefined}
          error={error}
          helperText={helperText}
        />
      )}
    />
  )
}
